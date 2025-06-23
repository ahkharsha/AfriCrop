// src/components/Card.tsx (1)
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
    <div className={`bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="border-b border-secondary-100 px-6 py-4 flex justify-between items-center">
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