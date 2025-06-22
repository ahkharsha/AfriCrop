// components/ui/Textarea.tsx
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const textareaVariants = cva(
  'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:outline-none transition-all duration-200',
  {
    variants: {
      variant: {
        default:
          'text-primary-900 ring-primary-300 placeholder:text-primary-400 focus:ring-primary-500 bg-white',
        error:
          'text-red-900 ring-red-300 placeholder:text-red-400 focus:ring-red-500 bg-white',
        success:
          'text-green-900 ring-green-300 placeholder:text-green-400 focus:ring-green-500 bg-white',
      },
      size: {
        sm: 'text-sm px-2',
        md: 'text-base px-3',
        lg: 'text-lg px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string
  description?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, label, description, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-primary-700">
            {label}
          </label>
        )}
        <textarea
          className={textareaVariants({ variant, size, className })}
          ref={ref}
          {...props}
        />
        {description && !error && (
          <p className="text-xs text-secondary-500">{description}</p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }