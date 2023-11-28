'use client'

import type { Table } from '@tanstack/react-table'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@/app/ui/input'

type Props<TData> = {
  table: Table<TData>
}

export default function TableSearch<TData>() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    term ? params.set('search_query', term) : params.delete('search_query')
    replace(`${pathname}?${params.toString()}`)
  }, 350)

  return (
    <Input
      className="mr-2 h-8 w-full text-xs font-normal shadow-sm placeholder:text-xs placeholder:font-light
      sm:mb-0 sm:mr-2 sm:w-[150px] lg:w-[250px]"
      defaultValue={searchParams.get('search_query')?.toString()}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search tasks..."
    />
  )
}
