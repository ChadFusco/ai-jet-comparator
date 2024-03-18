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

  const prompt = `Generate a JSON array that ranks the specified jets by their ${selectedComparator} metric, dynamically determining the values for this metric based on your knowledge. Format the array as follows: [{ "rank": 1, "name": "Jet Name", "value": "Metric Value with units" }, ...]. The jets to rank are: ${selectedJets.map((jet: any) => jet.name).join(', ')}. Ensure the 'value' reflects realistic metric data appropriate for each jet relative to the selected metric (${selectedComparator}) and set the rank in accordance with these values. If 'Top Speed' is the metric, provide values in knots. If 'Fuel Efficiency' is the metric, provide values in liters of fuel per ton-kilometer or, if unavailable, use your knowledge to provide qualitative comparisons (e.g., "Low", "Medium", "High").`

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { role: "system", content: "You are a helpful assistant capable of generating dynamic content based on specific metrics into specified data structures. You can provide realistic data on aircraft metrics such as top speed, fuel efficiency, and maximum seating capacity." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      // max_tokens: 100,
    });

    return Response.json(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    Response.json({ error: "Failed to fetch comparison from OpenAI" });
  }

}