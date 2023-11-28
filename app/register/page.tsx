import type { Metadata } from 'next'

import RegisterForm from '@/app/ui/RegisterForm'
import { buttonVariants } from '@/app/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

import bgImage from '../../public/bg.jpg'

export const metadata: Metadata = {
  title: 'Registration',
  description: '',
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
              Registration
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill out the fields below to create your account
            </p>
          </div>
          <RegisterForm />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <Link
            className={cn(
              'group flex items-center text-sm',
              buttonVariants({ variant: 'outline' })
            )}
            href="/login"
          >
            <ArrowLeft
              className="transition-transform duration-150 ease-in-out group-hover:-translate-x-2"
              width={16}
            />
            <span className="ml-2">Back to Login</span>
          </Link>{' '}
        </div>
      </div>
    </div>
  )
}
