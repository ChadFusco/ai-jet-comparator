export const dynamic = 'force-dynamic' // defaults to auto
import { prisma as db } from "@/app/db";
import OpenAI from "openai";

export async function GET() {
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

  const comparisons = {
    'Top Speed': {
      subprompt: `Provide all ${selectedComparator} values only in knots and no other unit of measurement. Do not report Mach number - only knots`,
    },
    'Fuel Efficiency': {
      subprompt: `Provide all ${selectedComparator} values in liters of fuel per ton-kilometer or, if unavailable, use your knowledge to provide qualitative comparisons (e.g., "Low", "Medium", "High")`,
    },
    'Maximum Seats': {
      subprompt: '',
    }
  };

  const prompt = `Generate a JSON array that ranks the specified aircraft by their ${selectedComparator}, dynamically determining the ${selectedComparator} values based on your knowledge. Format the array as follows: [{ "rank": 1, "name": "Aircraft Name", "value": "${selectedComparator} Value with units" }, ...]. The aircraft to rank are: ${selectedJets.map((jet: any) => jet.name).join(', ')}. Ensure the "value" reflects realistic ${selectedComparator} data for each aircraft, and set the rank in accordance with these values. ${comparisons[selectedComparator as keyof typeof comparisons].subprompt}`;

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