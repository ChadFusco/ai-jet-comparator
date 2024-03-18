'use client'

import React from "react";
import { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { SortDescriptor } from "@nextui-org/react";

export default function JetTable(props: { jets: any }) {
  const [isLoading, setIsLoading] = useState(true);

  let list = useAsyncList({
    load() {
      setIsLoading(false);
      return { items: props.jets };
    },
    sort({ items, sortDescriptor }: { items: any, sortDescriptor: SortDescriptor }) {
      return {
        items: items.sort((a: any, b: any) => {
          let first = a[sortDescriptor.column as string];
          let second = b[sortDescriptor.column as string];
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
    initialSortDescriptor: {
      column: "wingspan",
      direction: "descending"
    }
  });

  const fields = [
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

  return (
    <Table
      aria-label="Table of Charter Jets"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      classNames={{
        table: "min-h-[400px]",
      }}
      selectionMode="multiple"
    >
      <TableHeader columns={fields}>
        {(column) => <TableColumn key={column.key} allowsSorting>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={list.items}
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item: any) => (
          <TableRow key={item.name}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
