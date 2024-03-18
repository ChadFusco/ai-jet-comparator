'use client'

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Selection, SortDescriptor, Spinner } from '@nextui-org/react';
const JetTable = dynamic( () => import('./_components/jetTable'), { ssr: false } ); // lazy loading

const jetFields = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "wingspan",
    label: "Wingspan (ft)",
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

const compareFields = [
  {
    key: "rank",
    label: "Rank",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "value",
    label: "Value",
  },
];

const initialJetSortDescriptor: SortDescriptor = {
  column: "wingspan",
  direction: "descending"
}

const initialCompareSortDescriptor: SortDescriptor = {
  column: "rank",
  direction: "ascending"
}

const comparisonFields = [
  'Top Speed',
  'Fuel Efficiency',
  'Maximum Seats'
];

export default function Home() {
  const [jets, setJets] = useState([]);
  const [selectedJets, setSelectedJets] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([comparisonFields[0]]));
  const [compareArray, setCompareArray] = useState<[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedComparator = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  useEffect(() => {
    async function fetchJets() {
      const res = await fetch('/api');
      const { sortedJets } = await res.json();
      setJets(sortedJets);
    }
    fetchJets();
  }, []);

  async function compareJets() {

    setIsLoading(true);

    const options = {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ selectedJets, selectedComparator }),
    };
    const res = await fetch('/api', options);

    const results = await res.json();
    const matches = results.match(/\[(.|\n)*?]/);

    if (matches) {
      const jsonArrayString = matches[0];
      try {
        const jsonArray = JSON.parse(jsonArrayString);
        setCompareArray(jsonArray);
      } catch {
        setCompareArray(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCompareArray(null);
    }
    setIsLoading(false);

  }

  function handleJetSelectionChange(keys: Selection) {
    setSelectedJets(
      keys === 'all' ?
        jets :
        jets.filter((jet: any) => keys.has(jet.name))
    );
  }

  return (
    <main className="flex flex-col gap-5 p-24 pt-6 max-w-[1200px] mx-auto">
      <div className="text-2xl">
        Top 10 Charter Jets
      </div>
      <div className="min-h-[440px]">
        <JetTable
          jets={jets}
          fields={jetFields}
          initialSortDescriptor={initialJetSortDescriptor}
          enableSelector={true}
          handleSelectionChange={handleJetSelectionChange}
        />
      </div>
      <div className="flex flex-row items-center gap-10">
        <div className="flex flex-row items-center gap-3">
          <div className="font-bold">
            Ask OpenAI to compare selected jets by:
          </div>
          <div>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  size="sm"
                  variant="bordered" 
                  className="capitalize"
                >
                  {selectedComparator}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select comparator field"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeys}
                onSelectionChange={(keys) => setSelectedKeys(new Set<string>(Array.from(keys as Set<string>)))}
              >
                {
                  comparisonFields.map(field => (
                    <DropdownItem key={field}>{field}</DropdownItem>
                  ))
                }
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <Button
          size="md"
          onPress={compareJets}
          isDisabled={selectedJets.length < 2}
          spinner={<Spinner />}
          isLoading={isLoading}
        >
          {isLoading ? '' : (selectedJets.length >= 2 ? "Compare Selected Jets" : "Select 2 or More Jets")}
        </Button>
      </div>
      <div className="text-2xl">
        Comparison Results
      </div>
      <JetTable
        jets={compareArray}
        fields={compareFields}
        initialSortDescriptor={initialCompareSortDescriptor}
        enableSelector={false}
        handleSelectionChange={() => {}}
      />
    </main>
  );
}
