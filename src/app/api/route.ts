export const dynamic = 'force-dynamic' // defaults to auto
import { prisma as db } from "@/app/db";
import OpenAI from "openai";

export async function GET(request: Request) {
  const rawJets = await db.jets.findMany({ take: 10 }); // refactor to take limit as query param
  const sortedJets = rawJets
    .map((jet: any) => (
      { ...jet, wingspan: jet.wingspan.toNumber() }
    ))
    .sort((a: any, b: any) => b.wingspan - a.wingspan);
  return Response.json({sortedJets});
}

export async function POST(request: Request) {

  const { selectedJets, selectedComparator } = await request.json();

  const prompt = `Generate a JSON array that ranks the following jets by their ${selectedComparator}. Format the array as follows: [{ "rank": 1, "name": "Jet Name", "value": "metric value" }, ...]. The jets to rank are: ${selectedJets.map(jet => jet.name).join(', ')}. Your response should consist solely of the JSON array`;

  console.log('prompt:', prompt)

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log('sending to openai...')
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4,
      // max_tokens: 100,
    });

    console.log(completion.choices);

    return Response.json(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    Response.json({ error: "Failed to fetch comparison from OpenAI" });
  }

}