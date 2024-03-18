'use client'

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { prisma as db } from "@/app/db";
import { Button } from '@nextui-org/react';
const JetTable = dynamic( () => import('./_components/jetTable'), { ssr: false } ); // lazy loading

const jetFields = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "wingspan",
    label: "Wingspan",
  },
  {
    key: "engine_qty",
    label: "Engines",
  },
  {
    key: "year_manufactured",
    label: "Manufacturing Year",
  },
];

const comparisonFields = [
  'Top Speed',
  'Fuel Efficiency',
  'Maximum Seats'
]

export default function Home() {
  const [jets, setJets] = useState([]);

  useEffect(() => {
    async function fetchJets() {
      const res = await fetch('http://localhost:3000/api');
      const { sortedJets } = await res.json();
      setJets(sortedJets);
    }

    fetchJets();
  }, []);

  return (
    <main className="flex flex-col gap-5 p-24">
      <div className="text-2xl">
        Top 10 Charter Jets
      </div>
      <div className="min-h-[440px]">
        <JetTable jets={jets} fields={jetFields}/>
      </div>
      <div className="flex flex-row items-center gap-3">
        <div className="font-bold">
          Ask OpenAI to compare selected jets by:
        </div>
        <div className="w-40">
          <select className="form-select block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            {
              comparisonFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))
            }
          </select>
        </div>
        <Button size="md">
          Compare Selected Jets
        </Button>
      </div>
    </main>
  );
}
