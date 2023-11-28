import type { Table } from '@tanstack/react-table'

import ResetFiltersButton from '@/app/ui/ResetFiltersButton'
import TableSearch from '@/app/ui/TasksTable/TableSearch'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { priorities, statuses } from '@/app/lib/data'
import { buttonVariants } from '@/app/ui/button'
import Link from 'next/link'
import { clsx } from 'clsx'

import TableFacetedFilter from './TableFacetedFilter'
import TableViewOptions from './TableViewOptions'

interface TableToolbarProps<TData> {
  table: Table<TData>
}

export default function TableToolbar<TData>({
  table,
}: TableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="w-full items-center sm:flex sm:w-fit">
          <div className="mb-2 flex w-full sm:mb-0 sm:mr-8 sm:w-fit">
            <div className="flex w-full sm:w-fit">
              <TableSearch />
              <Link
                className={clsx(
                  'flex !h-8 items-center px-3 py-2',
                  buttonVariants({
                    variant: 'default',
                  })
                )}
                href="/tasks/create"
              >
                <PlusCircledIcon className="mr-2" height={16} width={16} />
                <span className="text-xs">Add</span>
              </Link>
            </div>
          </div>
          <div className="flex gap-2">
            {table.getColumn('status') && (
              <TableFacetedFilter
                column={table.getColumn('status')}
                options={statuses}
                title="Status"
              />
            )}
            {table.getColumn('priority') && (
              <TableFacetedFilter
                column={table.getColumn('priority')}
                options={priorities}
                title="Priority"
              />
            )}
            <ResetFiltersButton />
          </div>
        </div>
      </div>
      <TableViewOptions table={table} />
    </div>
  )
}
