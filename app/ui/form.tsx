import {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  createContext,
  ElementRef,
  forwardRef,
  useContext,
  useId,
} from 'react'
import {
  ControllerProps,
  useFormContext,
  FormProvider,
  FieldValues,
  Controller,
  FieldPath,
} from 'react-hook-form'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import { Label } from '@/app/ui/label'
import { cn } from '@/app/lib/utils'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    formItemId: `${id}-form-item`,
    name: fieldContext.name,
    id,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div className={cn('space-y-2', className)} ref={ref} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = 'FormItem'

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { formItemId, error } = useFormField()

  return (
    <Label
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      ref={ref}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = forwardRef<
  ElementRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { formDescriptionId, formMessageId, formItemId, error } = useFormField()

  return (
    <Slot
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      id={formItemId}
      ref={ref}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      id={formDescriptionId}
      ref={ref}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { formMessageId, error } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      className={cn('text-sm font-medium text-destructive', className)}
      id={formMessageId}
      ref={ref}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  FormDescription,
  useFormField,
  FormControl,
  FormMessage,
  FormLabel,
  FormField,
  FormItem,
  Form,
}
