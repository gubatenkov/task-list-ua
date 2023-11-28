import type { Metadata } from 'next'

import { EditTaskForm } from '@/app/ui/EditTaskForm'
import Breadcrumbs from '@/app/ui/Breadcrumbs'
import { Separator } from '@/app/ui/separator'
import { Card } from '@/app/ui/card'

export const metadata: Metadata = {
  title: 'New Task',
  description: '',
}

export default function Page() {
  return (
    <>
      <section className="mb-2 xs:mb-6">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Task List', href: '/tasks', active: true },
            {
              href: '/tasks/create',
              label: 'Create Task',
              active: false,
            },
          ]}
        />
      </section>
      <Card className="overflow-hidden p-4 xs:p-8">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold tracking-tight xs:text-2xl">
            To create a task
          </h2>
          <p className="text-sm text-muted-foreground xs:text-lg">
            Manage new task settings and add it to the list.
          </p>
        </div>
        <Separator className="my-4 xs:my-6" />
        <div className="mx-auto max-w-2xl">
          <EditTaskForm mode="create" />
        </div>
      </Card>
    </>
  )
}
