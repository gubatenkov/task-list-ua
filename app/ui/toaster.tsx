'use client'

import {
  ToastDescription,
  ToastProvider,
  ToastViewport,
  ToastClose,
  ToastTitle,
  Toast,
} from '@/app/ui/toast'
import { useToast } from '@/app/ui/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ description, action, title, id, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
