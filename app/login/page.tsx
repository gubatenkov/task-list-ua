import type { Metadata } from 'next'

import AuthForm from '@/app/ui/AuthForm'
import bgImage from '@/public/bg.jpg'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  description: '',
  title: 'Login',
}

export default async function Page() {
  return (
    <div
      className="container relative grid h-screen flex-col items-center justify-center
      lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <Image
          className="absolute bottom-0 left-0 right-0 top-0 inline-flex h-full w-full object-cover"
          sizes="(min-width: 320px) 100vw"
          placeholder="blur"
          blurDataURL=""
          // src="/bg.jpg"
          src={bgImage}
          height={960}
          width={875}
          priority
          alt=""
        />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “Life isn’t about finding yourself. Life is about creating
              yourself.” -
            </p>
            <footer className="text-sm">George Bernard Shaw</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter email below to enter in your account
            </p>
          </div>
          <AuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don&#39;t have an account yet?{' '}
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href="/register"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
