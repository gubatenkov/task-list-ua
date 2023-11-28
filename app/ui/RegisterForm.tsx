'use client'

import { type TRegisterForm, RegisterFormSchema } from '@/app/lib/schemaTypes'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { type FieldValues, useForm } from 'react-hook-form'
import { type HTMLAttributes, useState } from 'react'
import { createUser } from '@/app/lib/actions'
import { useToast } from '@/app/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Loader2Icon } from 'lucide-react'
import { Button } from '@/app/ui/button'
import { Input } from '@/app/ui/input'
import { Label } from '@/app/ui/label'
import { cn } from '@/app/lib/utils'

interface RegisterFormProps extends HTMLAttributes<HTMLDivElement> {}

export default function RegisterForm({
  className,
  ...props
}: RegisterFormProps) {
  const {
    formState: { errors },
    reset: resetFormState,
    handleSubmit,
    register,
  } = useForm<TRegisterForm>({
    resolver: valibotResolver(RegisterFormSchema),
    mode: 'onSubmit',
  })
  const [isFetching, setIsFetching] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const onRegisterSubmit = async (formData: FieldValues) => {
    setIsFetching(true)
    const response = await createUser(formData)

    if (response.error) {
      setIsFetching(false)
      toast({
        description: response.error.message,
        title: 'Error!',
      })
    } else if (response.success) {
      toast({
        description: response.message,
        title: 'Success!',
      })
      resetFormState()
      setIsFetching(false)
      router.push('/login')
    } else {
      setIsFetching(false)
      toast({
        description: 'Unexpected result of registration.',
        title: 'Oops!',
      })
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onRegisterSubmit)}>
        <div className="grid">
          <div className="mb-4 grid">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              {...register('name')}
              placeholder="Your name"
              autoCapitalize="none"
              disabled={isFetching}
              autoComplete="name"
              className="mb-1.5"
              autoCorrect="off"
              type="text"
              id="name"
            />
            <p className="mb-2 text-xs leading-[1] text-red-400">
              {errors.name?.message}
            </p>
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              {...register('email')}
              placeholder="Your email"
              autoCapitalize="none"
              disabled={isFetching}
              autoComplete="email"
              autoCorrect="off"
              className="mb-2"
              type="email"
              id="email"
            />
            <p className="mb-2 text-xs leading-[1] text-red-400">
              {errors.email?.message}
            </p>
            <Input
              {...register('password')}
              autoComplete="password"
              placeholder="Password"
              autoCapitalize="none"
              disabled={isFetching}
              autoCorrect="off"
              className="mb-2"
              type="password"
              id="password"
            />
            <p className="mb-2 text-xs leading-[1] text-red-400">
              {errors.password?.message}
            </p>
            <Input
              {...register('confirmPassword')}
              placeholder="Confirm password"
              autoComplete="password"
              autoCapitalize="none"
              disabled={isFetching}
              id="confirmPassword"
              autoCorrect="off"
              className="mb-2"
              type="password"
            />
            <p className="mb-2 text-xs leading-[1] text-red-400">
              {errors.confirmPassword?.message}
            </p>
          </div>
          <Button disabled={isFetching} className="relative" type="submit">
            <Loader2Icon
              className={cn(
                'absolute left-[calc(50%-4.5rem)] mr-2 hidden h-4 w-4 animate-spin',
                {
                  block: isFetching,
                }
              )}
            />
            Create account
          </Button>
        </div>
      </form>
    </div>
  )
}
