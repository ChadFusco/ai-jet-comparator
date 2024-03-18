export const dynamic = 'force-dynamic' // defaults to auto
import { prisma as db } from "@/app/db";

export async function GET(request: Request) {
  const rawJets = await db.jets.findMany({ take: 10 }); // refactor to take limit as query param
  const sortedJets = rawJets
    .map((jet: any) => (
      { ...jet, wingspan: jet.wingspan.toNumber() }
    ))
    .sort((a: any, b: any) => b.wingspan - a.wingspan);
  return Response.json({sortedJets});
}
