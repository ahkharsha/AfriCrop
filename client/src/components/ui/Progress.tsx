import React from 'react'
import { cva } from 'class-variance-authority'

interface ProgressProps {
  value: number
  className?: string
}

const progressVariants = cva('h-2 w-full rounded-full overflow-hidden', {
  variants: {
    variant: {
      default: 'bg-primary-100',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={progressVariants({ className })}>
      <div
        className="h-full bg-primary-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}