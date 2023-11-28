'use client'

import { Skeleton } from '@/app/ui/skeleton'
import { useEffect, useState } from 'react'

export default function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearTimeout(id)
  }, [])

  if (!time) {
    return (
      <Skeleton className="inline-block h-5 w-[8rem] translate-y-0.5 xs:h-8 xs:w-[11rem]" />
    )
  }

  return (
    <span className="inline-block w-[8rem] pl-[0.75rem] xs:w-[11rem]">
      {time}
    </span>
  )
}
