// src/components/Card.tsx
import { ReactNode } from 'react'

export default function Card({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 ${className}`}>
      {children}
    </div>
  )
}