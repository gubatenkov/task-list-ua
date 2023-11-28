import NextAuth from 'next-auth'

import { authConfig } from './auth.config'

export const { handlers, signOut, signIn, auth } = NextAuth(authConfig)
