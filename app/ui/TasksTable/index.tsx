'use client'

import {
  getPaginationRowModel,
  getSortedRowModel,
  getCoreRowModel,
  type ColumnDef,
  useReactTable,
} from '@tanstack/react-table'
import {
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  Table,
} from '@/app/ui/table'
import TablePagination from '@/app/ui/TasksTable/TablePagination'
import TRow from '@/app/ui/TasksTable/TRow'
import { useEffect, useState } from 'react'

import TableToolbar from './TableToolbar'
import THead from './THead'

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  totalTaskCount: number
  data: TData[]
}

export default function TasksTable<TData, TValue>({
  totalTaskCount,
  columns,
  data,
}: TableProps<TData, TValue>) {
  const [localData, setLocalData] = useState(data)

  const table = useReactTable({
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    manualFiltering: false,
    data: localData,
    columns,
  })

  useEffect(() => {
    setLocalData(data)
  }, [data])

  // Define option to update data from any part of the table
  table.options.meta = {
    ...table.options.meta,
    setLocalData,
  }

  return (
    <div className="space-y-4">
      <TableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <THead key={header.id} {...header} />
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel()?.rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => <TRow key={row.id} {...row} />)
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination total={totalTaskCount} table={table} />
    </div>
  )
}
