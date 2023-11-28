'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@/app/ui/button'
import { clsx } from 'clsx'

export default function ResetFiltersButton() {
  const readonlySearchParams = useSearchParams()
  const filters = [
    ...readonlySearchParams.getAll('priority'),
    ...readonlySearchParams.getAll('status'),
  ]
  const isHidden = !Boolean(filters.length > 0)
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleClick = () => {
    const params = new URLSearchParams(readonlySearchParams)
    params.delete('priority')
    params.delete('status')
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Button
      className={clsx('hidden h-8 px-2 text-xs xs:flex lg:px-3', {
        '!hidden': isHidden,
      })}
      onClick={handleClick}
      variant="ghost"
    >
      Reset
      <Cross2Icon className="ml-2 h-4 w-4" />
    </Button>
  )
}
