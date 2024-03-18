import dynamic from 'next/dynamic';
import { prisma as db } from './db';
const JetTable = dynamic( () => import('./_components/jetTable'), { ssr: false } ); // lazy loading

export default async function Home() {

  const rawJets = await db.jets.findMany({ take: 10 });
  const jets = rawJets
    .map((jet: any) => (
      { ...jet, wingspan: jet.wingspan.toNumber() }
    ))
    .sort((a: any, b: any) => b.wingspan - a.wingspan);

  return (
    <main className="flex min-h-screen flex-col gap-5 p-24">
      <div className="text-2xl">
        Top 10 Charter Jets
      </div>
      <div className="min-h-[440px]">
        <JetTable jets={jets}/>
      </div>
      <div className="font-bold">
        Ask OpenAI to compare selected jets by:
      </div>
    </main>
  );
}
