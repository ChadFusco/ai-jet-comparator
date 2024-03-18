import React, { Key, useEffect } from "react";
import { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner, Selection } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { SortDescriptor } from "@nextui-org/react";

export default function JetTable(props: {
  jets: any,
  fields: { key: Key, label: string }[],
  initialSortDescriptor: SortDescriptor,
  enableSelector: boolean,
  handleSelectionChange: ((keys: Selection) => void)
}) {
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
    initialSortDescriptor: props.initialSortDescriptor
  });

  useEffect(() => {
    setIsLoading(true);
    list.reload();
  }, [props.jets]);

  let numberSelected: number = 0;

  return (
    <Table
      aria-label="Table of Charter Jets"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      onSelectionChange={props.handleSelectionChange}
      selectionMode={props.enableSelector ? 'multiple' : 'none'}
    >
      <TableHeader columns={props.fields}>
        {(column) => <TableColumn key={column.key} allowsSorting>{column.label}</TableColumn>}
      </TableHeader>
      {
        props.jets !== null ?
          (
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
          ) :
          (
            <TableBody items={[]}>
              <TableRow key={"ERROR"}>
                <TableCell className="italic font-extrabold tracking-widest">
                  ERROR! Please try again.
                </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableBody>
          )
      }
    </Table>
  );
}
