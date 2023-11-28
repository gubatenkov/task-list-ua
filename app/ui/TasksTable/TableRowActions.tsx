import type { TTaskLabelValue, TTask } from '@/app/lib/schemaTypes'
import type { SetStateAction, Dispatch } from 'react'
import type { Row } from '@tanstack/react-table'

import {
  DropdownMenuRadioGroup,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenu,
} from '@/app/ui/dropdown-menu'
import { updateTaskLabelById, deleteTask } from '@/app/lib/actions'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useToast } from '@/app/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/app/ui/button'
import { labels } from '@/app/lib/data'

interface TableRowActionsProps<TData> {
  setLocalData: Dispatch<SetStateAction<TData[]>>
  row: Row<TData>
}

export default function TableRowActions<TData extends TTask>({
  row: { toggleSelected, original: task },
  setLocalData,
}: TableRowActionsProps<TData>) {
  const [isDeleted, setIsDeleted] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    const result = await deleteTask(task.id)
    if (result.success) {
      toast({
        description: result.message,
        title: 'Success!',
      })
      blockRow()
    } else {
      toast({
        description: result.message,
        title: 'Error!',
      })
    }
  }

  const blockRow = () => {
    toggleSelected(true)
    setIsDeleted(true)
  }

  useEffect(() => {
    return toggleSelected(false)
  }, [toggleSelected])

  const updateLocalTaskLabel = (label: TTaskLabelValue) => {
    let prevLabel = 'feature'
    setLocalData((prev) => {
      return prev.map((prevTask) => {
        if (prevTask.id === task.id) {
          prevLabel = prevTask.label
          return {
            ...prevTask,
            label,
          }
        }
        return prevTask
      })
    })
    return prevLabel as TTaskLabelValue
  }

  const handleLabelChange = async (labelValue: string) => {
    const newLabel = labelValue as TTaskLabelValue
    // First immediately update label in local task
    const prevLabel = updateLocalTaskLabel(newLabel)
    // Then query update of task label in database
    const result = await updateTaskLabelById(task.id, newLabel)
    // If task label was not updated in db, restore original value
    if (!result.success) updateLocalTaskLabel(prevLabel)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isDeleted} asChild>
        <Button
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          variant="ghost"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[160px]" align="end">
        <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              onValueChange={handleLabelChange}
              value={task.label}
            >
              {labels.map((label) => (
                <DropdownMenuRadioItem value={label.value} key={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
