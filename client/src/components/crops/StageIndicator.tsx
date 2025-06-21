import React from 'react'
import { useTranslations } from 'next-intl'

interface StageIndicatorProps {
  stage: string
  className?: string
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({
  stage,
  className,
}) => {
  const t = useTranslations('Crops')
  const stages = ['SOWN', 'GROWING', 'HARVESTED', 'SELLING', 'SOLD']
  const currentIndex = stages.indexOf(stage)

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {stages.map((s, index) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentIndex
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-100 text-primary-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs mt-1 ${
                index <= currentIndex
                  ? 'text-primary-700 font-medium'
                  : 'text-secondary-500'
              }`}
            >
              {t(`stages.${s.toLowerCase()}`)}
            </span>
          </div>
          {index < stages.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                index < currentIndex ? 'bg-primary-500' : 'bg-primary-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}