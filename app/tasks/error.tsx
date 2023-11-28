'use client'

import { buttonVariants, Button } from '@/app/ui/button'
import { cn } from '@/app/lib/utils'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <h2 className="mb-4 text-center">Something went wrong!</h2>
      <Link
        className={cn(buttonVariants({ variant: 'default' }))}
        href="/tasks"
      >
        Back to Tasks
      </Link>
    </div>
  )
}
