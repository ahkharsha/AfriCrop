import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      outline: 'btn-outline',
      ghost: 'hover:bg-primary-50 text-primary-700',
    },
    size: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }