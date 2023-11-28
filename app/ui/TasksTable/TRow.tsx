import { flexRender, type Row } from '@tanstack/react-table'
import { TableCell, TableRow } from '@/app/ui/table'
import { cn } from '@/app/lib/utils'

type Props<TData> = Row<TData>

export default function TRow<TData>({
  getVisibleCells,
  getIsSelected,
}: Props<TData>) {
  return (
    <TableRow
      className={cn('', {
        'opacity-50': getIsSelected(),
      })}
      // data-state={getIsSelected() && 'selected'}
    >
      {getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}
