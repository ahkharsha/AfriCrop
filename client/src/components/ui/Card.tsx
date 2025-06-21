import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva('card', {
  variants: {
    variant: {
      default: '',
      elevated: 'shadow-md hover:shadow-lg',
      bordered: 'border-2 border-primary-200',
    },
    padding: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string
  description?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ variant, padding, className })}
        {...props}
      >
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-primary-700">{title}</h3>
            {description && (
              <p className="text-sm text-secondary-600 mt-1">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card, cardVariants }