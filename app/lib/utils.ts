import {
  TaskPriorityValueSchema,
  TaskStatusValueSchema,
} from '@/app/lib/schemaTypes'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { safeParse } from 'valibot'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function validateStatusFilter(status: undefined | string[] | string) {
  if (typeof status === 'undefined') return ''

  if (Array.isArray(status)) {
    const validated = safeParse(TaskStatusValueSchema, status)
    return validated.success ? status.join(' & ') : ''
  }

  return status
}

export function validatePriorityFilter(
  priority: undefined | string[] | string
) {
  if (typeof priority === 'undefined') return ''

  if (Array.isArray(priority)) {
    const validated = safeParse(TaskPriorityValueSchema, priority)
    return validated.success ? priority.join(' & ') : ''
  }

  return priority
}

export function validPageParams({
  perPageParam,
  pageParam,
}: {
  perPageParam: undefined | string | null
  pageParam: undefined | string | null
}): { perPage: number; page: number } {
  let defaultPageNumber = 1
  let defaultPerPageNumber = 10
  const maybePageNumber = Number(pageParam)
  const maybePerPageNumber = Number(perPageParam)

  // Check if ?=page is valid number
  if (!isNaN(maybePageNumber)) {
    // If number is negative - return default page number
    defaultPageNumber =
      maybePageNumber > 0 ? maybePageNumber : defaultPageNumber
  }

  // Check if ?=perPage is valid number
  if (!isNaN(maybePerPageNumber)) {
    // If number is negative - return default page number
    defaultPerPageNumber =
      maybePerPageNumber > 0 ? maybePerPageNumber : defaultPerPageNumber
  }

  return { perPage: defaultPerPageNumber, page: defaultPageNumber }
}
