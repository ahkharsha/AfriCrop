import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const selectVariants = cva(
  'block w-full rounded-md border-0 py-1.5 pl-3 pr-10 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:outline-none transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'text-primary-900 ring-primary-300 focus:ring-primary-500 bg-white',
        error: 'text-red-900 ring-red-300 focus:ring-red-500 bg-white',
        success: 'text-green-900 ring-green-300 focus:ring-green-500 bg-white',
      },
      selectSize: {
        sm: 'text-sm h-8',
        md: 'text-base h-10',
        lg: 'text-lg h-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'md',
    },
  }
)

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  label?: string
  description?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
  onValueChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      selectSize,
      label,
      description,
      error,
      options,
      placeholder,
      onChange,
      onValueChange,
      value,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value)
      }
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-primary-700">
            {label}
          </label>
        )}
        <select
          className={selectVariants({ variant, selectSize, className })}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {description && !error && (
          <p className="text-xs text-secondary-500">{description}</p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }