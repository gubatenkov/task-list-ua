import type { SetStateAction, Dispatch } from 'react'
import type { RowData } from '@tanstack/table-core'

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    setLocalData: Dispatch<SetStateAction<TData[]>>
  }
}
