import type { Metadata } from 'next'

import { EditTaskForm } from '@/app/ui/EditTaskForm'
import { getUserTaskById } from '@/app/lib/actions'
import Breadcrumbs from '@/app/ui/Breadcrumbs'
import { Separator } from '@/app/ui/separator'
import { notFound } from 'next/navigation'
import { Card } from '@/app/ui/card'

export const metadata: Metadata = {
  title: 'Edit Task',
  description: '',
}

export default async function Page({
  params: { id },
}: {
  params: { id?: string }
}) {
  const { task } = await getUserTaskById(id)

  if (!task) notFound()

  return (
    <>
      <section className="mb-2 xs:mb-6">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Task List', href: '/tasks', active: true },
            {
              href: `/tasks/${id}`,
              label: 'Edit Task',
              active: false,
            },
          ]}
        />
      </section>
      <Card className="overflow-hidden p-4 xs:p-8">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold tracking-tight xs:text-2xl">
            Edit Task
          </h2>
          <p className="text-sm text-muted-foreground xs:text-lg">
            Update the task <span className="font-bold">{id}</span> and save
            info.
          </p>
        </div>
        <Separator className="my-4 xs:my-6" />
        <div className="mx-auto max-w-2xl">
          <EditTaskForm task={task} mode="edit" />
        </div>
      </Card>
    </>
  )
}
