'use client'

import type { TTaskPriority, TTaskStatus, TTask } from '@/app/lib/schemaTypes'
import type { ColumnDef } from '@tanstack/react-table'

import { priorities, statuses, iconsMap, labels } from '@/app/lib/data'
import { DividerHorizontalIcon } from '@radix-ui/react-icons'
import { CheckCircle2 } from 'lucide-react'
import { Badge } from '@/app/ui/badge'

import TableColumnHeader from './TableColumnHeader'
import TableRowActions from './TableRowActions'

const columns: ColumnDef<TTask>[] = [
  {
    cell: () => <CheckCircle2 className="mx-auto" height={14} width={14} />,
    accessorKey: 'select',
    enableSorting: false,
    enableHiding: false,
    header: () => {},
    id: 'select',
  },
  {
    header: ({ column }) => (
      <div className="text-xs">
        <TableColumnHeader column={column} title="Task" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[80px] truncate font-light">{row.getValue('id')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    accessorKey: 'id',
  },
  {
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {label && (
            <Badge className="text-xs font-medium" variant="outline">
              {label.label}
            </Badge>
          )}
          <span className="font-base max-w-[500px] truncate">
            {row.getValue('title')}
          </span>
        </div>
      )
    },
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
    accessorKey: 'title',
  },
  {
    cell: ({ row }) => {
      const status: TTaskStatus | undefined = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      const Icon =
        status.icon in iconsMap ? iconsMap[status.icon] : DividerHorizontalIcon

      return (
        <div className="flex w-[100px] items-center">
          {status.icon in iconsMap && (
            <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-light">{status.label}</span>
        </div>
      )
    },
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    accessorKey: 'status',
  },
  {
    cell: ({ row }) => {
      const priority: TTaskPriority | undefined = priorities.find(
        (priority) => priority.value === row.getValue('priority')
      )

      if (!priority) {
        return null
      }

      const Icon =
        priority.icon in iconsMap
          ? iconsMap[priority.icon]
          : DividerHorizontalIcon

      return (
        <div className="flex items-center">
          {priority.icon && (
            <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-light">{priority.label}</span>
        </div>
      )
    },
    header: ({ column }) => (
      <TableColumnHeader title="Priority" column={column} />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    accessorKey: 'priority',
  },
  {
    cell: ({ table, row }) => (
      <TableRowActions
        setLocalData={table.options.meta!.setLocalData}
        row={row}
      />
    ),
    accessorKey: '',
    id: 'actions',
  },
]

export default columns
