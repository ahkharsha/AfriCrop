// src/components/Card.tsx
import { ReactNode } from 'react'

export default function Card({
  children,
  className = '',
  title,
  action,
}: {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="border-b border-secondary-200 p-4 flex justify-between items-center">
          {title && <h3 className="font-semibold text-lg text-secondary-800">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}