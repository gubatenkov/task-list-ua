import type { Metadata } from 'next'

import { Toaster } from '@/app/ui/toaster'
import { Inter } from 'next/font/google'

import Providers from './ui/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Task List',
    default: 'Task List',
  },
  metadataBase: new URL('https://tasks-dashboard.vercel.app'),
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <Providers>
          <div>
            <main>{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
