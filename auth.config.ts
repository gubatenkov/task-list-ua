import type { NextAuthConfig } from 'next-auth'

import { LoginFormSchema, type TUser } from '@/app/lib/schemaTypes'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import prisma from '@/app/lib/prisma'
import { safeParse } from 'valibot'
import { compare } from 'bcryptjs'

async function getUser(email: string): Promise<TUser | null> {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        email,
      },
    })) as TUser
    return user ? user : null
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Github({
      profile(profile) {
        return {
          name: profile.name || profile.login,
          gh_username: profile.login,
          id: profile.id.toString(),
          image: profile.avatar_url,
          email: profile.email,
        }
      },
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientId: process.env.GITHUB_CLIENT_ID,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = safeParse(LoginFormSchema, {
          password: credentials.password,
          email: credentials.email,
        })

        // If validation fails, return errors early. Otherwise, continue.
        if (!parsedCredentials.success) {
          return null
        }

        const { password, email } = parsedCredentials.output

        const user = await getUser(email)
        if (!user) return null

        const passwordsMatch = await compare(password, user.password)
        return passwordsMatch
          ? {
              image: user.image ?? '',
              email: user.email,
              name: user.name,
              id: user.id,
            }
          : null
      },
    }),
  ], // Add providers with an empty array for now
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user
      const isOnTaskBoard = nextUrl.pathname.startsWith('/tasks')

      if (isOnTaskBoard) {
        return isLoggedIn // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/tasks', nextUrl))
      }

      return true
    },
    session: async ({ newSession, session, trigger, token, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          image: session.user?.image ?? '',
          name: token.name,
          id: token.sub,
        },
      }
    },
    jwt: async ({ session, profile, account, token, user }) => {
      return user
        ? {
            ...token,
            image: user.image,
            name: user.name,
            id: token.sub,
          }
        : token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
}
