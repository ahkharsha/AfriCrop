import React from 'react'
import { Toast as ToastPrimitive } from '@radix-ui/react-toast'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-react'

const toastVariants = cva(
  'fixed right-4 bottom-4 z-50 w-full max-w-sm rounded-lg shadow-lg p-4 flex items-start',
  {
    variants: {
      variant: {
        default: 'bg-white border border-primary-200',
        success: 'bg-green-50 border border-green-200',
        error: 'bg-red-50 border border-red-200',
        warning: 'bg-yellow-50 border border-yellow-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface ToastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  variant?: 'default' | 'success' | 'error' | 'warning'
}

export const Toast: React.FC<ToastProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
}) => {
  return (
    <ToastPrimitive open={open} onOpenChange={onOpenChange}>
      <div className={toastVariants({ variant })}>
        <div className="flex-1">
          <ToastPrimitive.Title className="font-medium text-primary-900">
            {title}
          </ToastPrimitive.Title>
          <ToastPrimitive.Description className="mt-1 text-sm text-primary-600">
            {description}
          </ToastPrimitive.Description>
        </div>
        <ToastPrimitive.Close className="ml-4 p-1 rounded-full hover:bg-primary-100 transition-colors">
          <X className="h-4 w-4 text-primary-500" />
        </ToastPrimitive.Close>
      </div>
    </ToastPrimitive>
  )
}