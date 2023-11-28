import type {
  TTaskPriority,
  TTaskStatus,
  TTaskLabel,
} from '@/app/lib/schemaTypes'

import {
  QuestionMarkCircledIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  StopwatchIcon,
  ArrowUpIcon,
  CircleIcon,
} from '@radix-ui/react-icons'

export const iconsMap = {
  QuestionMarkCircledIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  StopwatchIcon,
  ArrowUpIcon,
  CircleIcon,
}
export type TIconsMap = keyof typeof iconsMap

export const labels: TTaskLabel[] = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses: TTaskStatus[] = [
  {
    icon: 'QuestionMarkCircledIcon',
    value: 'backlog',
    label: 'Backlog',
  },
  {
    icon: 'CircleIcon',
    value: 'todo',
    label: 'Todo',
  },
  {
    icon: 'StopwatchIcon',
    value: 'in progress',
    label: 'In Progress',
  },
  {
    icon: 'CheckCircledIcon',
    value: 'done',
    label: 'Done',
  },
  {
    icon: 'CrossCircledIcon',
    value: 'canceled',
    label: 'Canceled',
  },
]

export const priorities: TTaskPriority[] = [
  {
    icon: 'ArrowDownIcon',
    label: 'Low',
    value: 'low',
  },
  {
    icon: 'ArrowRightIcon',
    label: 'Medium',
    value: 'medium',
  },
  {
    icon: 'ArrowUpIcon',
    label: 'High',
    value: 'high',
  },
]
