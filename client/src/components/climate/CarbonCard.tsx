import React from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { ProgressRing } from '../ui/ProgressRing'

interface CarbonCardProps {
  data: {
    carbonSequestration: number
    waterSaved: number
    biodiversityScore: number
    sustainabilityScore: number
  }
}

export const CarbonCard: React.FC<CarbonCardProps> = ({ data }) => {
  const t = useTranslations('Climate')

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          {t('carbonTitle')}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={data.carbonSequestration}
              size={80}
              color="var(--color-primary-500)"
            />
            <span className="text-sm mt-2 text-center">
              {t('carbonSequestration')}
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={data.waterSaved}
              size={80}
              color="var(--color-blue-500)"
            />
            <span className="text-sm mt-2 text-center">
              {t('waterSaved')}
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={data.biodiversityScore}
              size={80}
              color="var(--color-green-500)"
            />
            <span className="text-sm mt-2 text-center">
              {t('biodiversity')}
            </span>
          </div>
          
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={data.sustainabilityScore}
              size={80}
              color="var(--color-accent-500)"
            />
            <span className="text-sm mt-2 text-center">
              {t('sustainability')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}