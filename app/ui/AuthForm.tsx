'use client'

import {
  authenticateUserViaCredentials,
  authenticateUserViaGithub,
} from '@/app/lib/actions'
import { type TLoginForm, LoginFormSchema } from '@/app/lib/schemaTypes'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { type FieldValues, useForm } from 'react-hook-form'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { type HTMLAttributes, useState } from 'react'
import { useToast } from '@/app/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/app/ui/button'
import { Input } from '@/app/ui/input'
import { Label } from '@/app/ui/label'
import { cn } from '@/app/lib/utils'

interface AuthFormProps extends HTMLAttributes<HTMLFormElement> {}

export default function AuthForm({ className, ...props }: AuthFormProps) {
  const {
    formState: { errors },
    reset: resetFormState,
    handleSubmit,
    register,
  } = useForm<TLoginForm>({
    defaultValues: {
      email: 'elon.musk@spacex.com',
      password: 'qwerty',
    },
    resolver: valibotResolver(LoginFormSchema),
    mode: 'onSubmit',
  })
  const [isFetching, setIsFetching] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const onSubmit = async (formData: FieldValues) => {
    setIsFetching(true)

    const { success, message, error } =
      await authenticateUserViaCredentials(formData)

    if (error) {
      setIsFetching(false)
      toast({
        description: error.message,
        title: 'Error!',
      })
    } else if (success) {
      toast({
        description: message,
        title: 'Success!',
      })
      setIsFetching(false)
      router.push('/tasks')
    } else {
      setIsFetching(false)
      toast({
        description: 'Unexpected result of authentication.',
        title: 'Oops!',
      })
    }
  }

  const handleGithubLogin = async () => {
    setIsFetching(true)
    const { redirectUrl, success } = await authenticateUserViaGithub()
    setIsFetching(true)
    success ? router.push(redirectUrl) : null
  }

  return (
    <div className={cn('grid gap-6', className)}>
      <form onSubmit={handleSubmit(onSubmit)} {...props}>
        <div className="grid">
          <div className="mb-4 grid">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              {...register('email')}
              placeholder="email@example.com"
              autoCapitalize="none"
              disabled={isFetching}
              autoComplete="email"
              autoCorrect="off"
              className="mb-2"
              type="email"
              id="email"
            />
            <Input
              {...register('password')}
              autoComplete="password"
              placeholder="password"
              autoCapitalize="none"
              disabled={isFetching}
              autoCorrect="off"
              type="password"
              id="password"
            />
          </div>
          <Button disabled={isFetching} className="relative" type="submit">
            <Loader2Icon
              className={cn(
                'absolute left-[calc(50%-5.25rem)] mr-2 hidden h-4 w-4 animate-spin',
                {
                  block: isFetching,
                }
              )}
            />
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        onClick={handleGithubLogin}
        disabled={isFetching}
        variant="outline"
      >
        {isFetching ? (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
        )}{' '}
        Github
      </Button>
    </div>
  )
}
