import * as React from 'react'
import { cn } from '@/lib/utils'

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    required?: boolean
  }
>(({ className, required = false, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : undefined,
      className
    )}
    {...props}
  >
    {children}
  </label>
))
Label.displayName = 'Label'

export { Label }