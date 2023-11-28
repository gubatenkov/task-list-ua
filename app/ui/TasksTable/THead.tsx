import { type Header, flexRender } from '@tanstack/react-table'
import { TableHead } from '@/app/ui/table'

type Props<TData, TValue> = Header<TData, TValue>

export default function THead<TData, TValue>({
  isPlaceholder,
  getContext,
  column,
}: Props<TData, TValue>) {
  return (
    <TableHead>
      {isPlaceholder ? null : flexRender(column.columnDef.header, getContext())}
    </TableHead>
  )
}
