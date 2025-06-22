// src/components/ProgressBar.tsx
'use client'

export default function ProgressBar({
  progress,
  className = '',
  color = 'bg-primary-600'
}: {
  progress: number
  className?: string
  color?: string
}) {
  return (
    <div className={`w-full bg-secondary-200 rounded-full h-2 ${className}`}>
      <div 
        className={`h-2 rounded-full ${color} transition-all duration-500`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}