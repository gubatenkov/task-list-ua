'use client'

import type { ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'

import SessionProvider from './SessionProvider'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
