'use client'

import type { ReactNode } from 'react'

import { SessionProvider } from 'next-auth/react'

type Props = {
  children: ReactNode
}

export default function Provider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>
}
