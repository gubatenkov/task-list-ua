import type { Table } from '@tanstack/react-table'

import {
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@radix-ui/react-icons'
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from '@/app/ui/select'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { validPageParams } from '@/app/lib/utils'
import { useCallback, useEffect } from 'react'
import { Button } from '@/app/ui/button'

interface TablePaginationProps<TData> {
  table: Table<TData>
  total: number
}

const perPageOptions = [10, 20, 30, 40, 50]

export default function TablePagination<TData>({
  table,
  total,
}: TablePaginationProps<TData>) {
  const readonlySearchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const { perPage, page } = validPageParams({
    perPageParam: readonlySearchParams.get('per_page'),
    pageParam: readonlySearchParams.get('page'),
  })
  const totalPages = Math.ceil(total / perPage)

  const handlePageClick = (page: number) => {
    const params = new URLSearchParams(readonlySearchParams)
    params.set('page', `${page}`)
    replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  const handleChangePerPage = useCallback(
    (value: string) => {
      const params = new URLSearchParams(readonlySearchParams)
      params.set('per_page', value)
      replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      })
      table.setPageSize(Number(value))
    },
    [pathname, readonlySearchParams, replace, table]
  )

  const perPageValue = perPageOptions.reduce((previousValue, currentValue) => {
    if (currentValue === perPage) {
      previousValue = perPage
    }
    return previousValue
  }, perPageOptions[0])

  useEffect(() => {
    table.setPageSize(perPageValue)
  }, [perPageValue, table])

  return (
    <div className="flex w-full items-center justify-between xs:px-2">
      <div className="hidden xs:block" />
      <div
        className="ml-auto flex w-full max-w-[13rem] flex-col items-center space-x-6
        xs:ml-[none] xs:w-fit xs:max-w-none xs:flex-row lg:space-x-8"
      >
        <div
          className="mb-2 flex w-full items-center justify-between space-x-2
          xs:mb-0 xs:w-fit"
        >
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            onValueChange={handleChangePerPage}
            value={perPageValue.toString()}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {perPageOptions.map((perPageOption) => (
                <SelectItem value={`${perPageOption}`} key={perPageOption}>
                  {perPageOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="!ml-0 flex w-full items-center xs:w-fit xs:space-x-2">
          <div
            className="mr-auto flex w-fit items-center justify-center text-sm
            font-medium xs:mr-0 xs:w-[100px]"
          >
            Page {page} of {totalPages}
          </div>
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageClick(1)}
            disabled={page === 1}
            variant="outline"
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handlePageClick(page - 1)}
            className="mr-2 h-8 w-8 p-0 xs:mr-0"
            disabled={page === 1}
            variant="outline"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handlePageClick(page + 1)}
            disabled={page === totalPages}
            className="h-8 w-8 p-0"
            variant="outline"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handlePageClick(totalPages)}
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={page === totalPages}
            variant="outline"
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
