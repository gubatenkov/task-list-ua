'use client'

import {
  CommandSeparator,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
} from '@/app/ui/command'
import {
  DividerHorizontalIcon,
  PlusCircledIcon,
  CheckIcon,
} from '@radix-ui/react-icons'
import {
  useSearchParams,
  usePathname,
  useParams,
  useRouter,
} from 'next/navigation'
import { PopoverContent, PopoverTrigger, Popover } from '@/app/ui/popover'
import { type TIconsMap, iconsMap } from '@/app/lib/data'
import { Separator } from '@/app/ui/separator'
import { Column } from '@tanstack/react-table'
import { Button } from '@/app/ui/button'
import { Badge } from '@/app/ui/badge'
import { cn } from '@/app/lib/utils'

interface DataTableFacetedFilterProps<TData, TValue> {
  options: {
    icon?: TIconsMap
    label: string
    value: string
  }[]
  column?: Column<TData, TValue>
  title: string
}

export default function TableFacetedFilter<TData, TValue>({
  options,
  column,
  title,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const readonlySearchParams = useSearchParams()
  const selectedValues = new Set(
    readonlySearchParams.getAll(title.toLowerCase())
  )
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleResetFilters = () => {
    const params = new URLSearchParams(readonlySearchParams)
    params.delete(title.toLowerCase())
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-8 border-dashed shadow-sm"
          variant="outline"
          size="sm"
        >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          <span className="text-xs">{title}</span>
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                className="rounded-sm px-1 font-normal lg:hidden"
                variant="secondary"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 text-xs lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    className="rounded-sm px-1 font-normal"
                    variant="secondary"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        className="rounded-sm px-1 font-normal"
                        variant="secondary"
                        key={option.value}
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = readonlySearchParams.has(
                  title.toLowerCase(),
                  option.value
                )
                const Icon =
                  option.icon && option.icon in iconsMap
                    ? iconsMap[option.icon]
                    : DividerHorizontalIcon
                return (
                  <CommandItem
                    onSelect={() => {
                      const params = new URLSearchParams(readonlySearchParams)
                      isSelected
                        ? params.delete(title.toLowerCase(), option.value)
                        : params.append(title.toLowerCase(), option.value)
                      replace(`${pathname}?${params.toString()}`)
                    }}
                    key={option.value}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="justify-center text-center"
                    onSelect={handleResetFilters}
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
