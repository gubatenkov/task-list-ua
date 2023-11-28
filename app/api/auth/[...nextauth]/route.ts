import { authConfig } from '@/auth.config'
import NextAuth from 'next-auth'

export const {
  handlers: { POST, GET },
} = NextAuth(authConfig)

export const runtime = 'edge'
