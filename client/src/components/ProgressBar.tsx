// src/components/ProgressBar.tsx
'use client'

import { useTranslations } from '../utils/i18n'

export default function ProgressBar({
  progress,
  className = '',
  color = 'bg-primary-600'
}: {
  progress: number
  className?: string
  color?: string
}) {
  const t = useTranslations()
  
  return (
    <div className={`w-full bg-secondary-200 rounded-full h-2.5 ${className}`}>
      <div 
        className={`h-2.5 rounded-full ${color} transition-all duration-500 flex items-center justify-end`}
        style={{ width: `${progress}%` }}
      >
        <span className="text-white text-xs font-medium px-1">
          {progress >= 50 ? `${progress}%` : ''}
        </span>
      </div>
      <div className="flex justify-between text-xs text-secondary-500 mt-1">
        <span>{t('start')}</span>
        <span>{t('complete')}</span>
      </div>
    </div>
  )
}