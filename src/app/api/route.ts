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

  const topSpeedSubprompt = 'The Top Speed metric value shall be in knots. Include the units in the metric value output';
  const fuelEfficiencySubprompt = 'The Fuel Efficiency metric value shall be in liters of fuel per ton-kilometer if this data is available (include the units in your output). If fuel efficency data in liters of fuel per ton-kilometer is unavailable for any of the request gets, provide comparative values (e.g. "Low", "Medium", "High", etc) instead.';

  const prompt = `Generate a JSON array that ranks the following jets by their ${selectedComparator} metric. Format the array as the following data structure: [{ "rank": [actual-rank-number], "name": [actual-name-string], "value": [actual-metric-value] }, ...]. The jets to rank are: ${selectedJets.map(jet => jet.name).join(', ')}. Your response should consist solely of the JSON array. ${selectedComparator === 'Top Speed' ? topSpeedSubprompt : (selectedComparator === 'Fuel Efficiency' ? fuelEfficiencySubprompt : '')}`;

  console.log('prompt:', prompt)

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log('sending to openai...')
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { role: "system", content: "You are a helpful assistant capable of generating dynamic content based on specific metrics into specified data structures." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      // max_tokens: 100,
    });

    console.log(completion.choices);

    return Response.json(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    Response.json({ error: "Failed to fetch comparison from OpenAI" });
  }

}