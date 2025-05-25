import { useState } from "react";
import { Box, Table } from "@chakra-ui/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface ICustomTableProps<T> {
  columns: ColumnDef<T>[];
  data: Array<T>;
}

export default function CustomTable<T>({
  columns,
  data,
}: ICustomTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
    // sortingFns: {
    //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
    // },
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      sorting,
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
    // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
    // enableSorting: false, // - default on/true
    // enableSortingRemoval: false, //Don't allow - default on/true
    // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
    // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
  });

  return (
    <Table.ScrollArea maxW={"100vw"}>
      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row backgroundColor={"gray.900"} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeader
                  color={"white"}
                  key={header.id}
                  borderColor={"gray.900"}
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder ? null : (
                    <Box
                      cursor={
                        header.column.getCanSort() ? "pointer" : "initial"
                      }
                      userSelect={
                        header.column.getCanSort() ? "none" : "initial"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </Box>
                  )}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => {
              return (
                <Table.Row backgroundColor={"transparent"} key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Table.Cell borderColor={"gray.900"} key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
