'use client'

import {
  FormDescription,
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
  FormItem,
  Form,
} from '@/app/ui/form'
import {
  SelectContent,
  SelectTrigger,
  SelectGroup,
  SelectValue,
  SelectItem,
  Select,
} from '@/app/ui/select'
import {
  TaskFormSchema,
  type TTaskForm,
  TaskSchema,
  TTask,
} from '@/app/lib/schemaTypes'
import { type SubmitHandler, Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { priorities, statuses, labels } from '@/app/lib/data'
import { createTask, updateTask } from '@/app/lib/actions'
import { toast } from '@/app/ui/use-toast'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/app/ui/button'
import { Input } from '@/app/ui/input'
import { cn } from '@/app/lib/utils'
import { safeParse } from 'valibot'
import { useState } from 'react'

type Props =
  | {
      task: unknown
      mode: 'edit'
    }
  | {
      mode: 'create'
    }

export function EditTaskForm(props: Props) {
  let taskId = ''
  const defaultFormValues: TTaskForm = {
    label: 'feature',
    priority: 'low',
    status: 'todo',
    title: '',
  }

  if (props.mode === 'edit') {
    const validatedTask = safeParse(TaskSchema, props.task)
    if (validatedTask.success && props.task) {
      const { priority, status, title, label, id } = validatedTask.output
      defaultFormValues.priority = priority
      defaultFormValues.status = status
      defaultFormValues.label = label
      defaultFormValues.title = title
      taskId = id
    }
  }

  const [isProcessing, setIsProcessing] = useState(false)
  const form = useForm<TTaskForm>({
    resolver: valibotResolver(TaskFormSchema),
    defaultValues: defaultFormValues,
  })

  const onSubmit: SubmitHandler<TTaskForm> = async (data) => {
    setIsProcessing(true)
    const { success, message, task } =
      props.mode === 'edit'
        ? await updateTask(taskId, data)
        : await createTask(data)

    if (!success) {
      toast({
        description: message,
        title: 'Error!',
      })
      setIsProcessing(false)
      return
    }

    toast({
      description: message,
      title: 'Success!',
    })

    if (props.mode === 'edit') {
      const { priority, status, label, title } = task as TTask
      defaultFormValues.priority = priority
      defaultFormValues.status = status
      defaultFormValues.label = label
      defaultFormValues.title = title
    } else {
      form.reset()
    }

    setIsProcessing(false)
  }

  const isFieldDisabled = () => {
    return isProcessing || (props.mode === 'edit' && !props.task)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 xs:space-y-8"
      >
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormDescription className="text-xs xs:text-sm">
                This field will be displayed in tasks table on{' '}
                <span className="font-bold">/tasks </span>
                page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          disabled={isFieldDisabled()}
          control={form.control}
          name="title"
        />
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <FormItem className="mb-2 w-full text-left xs:mb-0">
              <FormLabel>Status</FormLabel>
              <Select onValueChange={onChange} {...field}>
                <SelectTrigger className="w-full" ref={ref}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statuses.map(({ label, value }) => (
                      <SelectItem value={value} key={value}>
                        <span>{label}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
          disabled={isFieldDisabled()}
          control={form.control}
          name="status"
        />
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <FormItem className="w-full text-left">
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={onChange} {...field}>
                <SelectTrigger className="w-full" ref={ref}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {priorities.map(({ label, value }) => (
                      <SelectItem value={value} key={value}>
                        <span>{label}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
          disabled={isFieldDisabled()}
          control={form.control}
          name="priority"
        />
        <Controller
          render={({ field: { onChange, ref, ...field } }) => (
            <FormItem className="mb-2 w-full text-left xs:mb-0">
              <FormLabel>Label</FormLabel>
              <Select onValueChange={onChange} {...field}>
                <SelectTrigger className="w-full" ref={ref}>
                  <SelectValue placeholder="Select task label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {labels.map(({ label, value }) => (
                      <SelectItem value={value} key={value}>
                        <span>{label}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
          disabled={isFieldDisabled()}
          control={form.control}
          name="label"
        />
        <Button
          className="relative w-full xs:w-fit"
          disabled={isFieldDisabled()}
          type="submit"
        >
          <Loader2Icon
            className={cn(
              'absolute left-[calc(50%-4.5rem)] mr-2 hidden h-4 w-4 animate-spin',
              {
                block: isProcessing,
              }
            )}
          />
          {props.mode === 'edit' ? 'Update task' : 'Create task'}
        </Button>
      </form>
    </Form>
  )
}
