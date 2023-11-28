import type { ReactNode } from 'react'

import Header from '@/app/ui/Header'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div
        className="container my-4 h-full flex-1 flex-col px-4 xs:my-8
        sm:px-8"
      >
        {children}
      </div>
    </>
  )
}
