import React from 'react'
import { useTranslations } from 'next-intl'
import { Crop } from '@/types'

interface CropTimelineProps {
  crops: Crop[]
}

export const CropTimeline: React.FC<CropTimelineProps> = ({ crops }) => {
  const t = useTranslations('Dashboard')
  
  const stages = [
    { id: 'sown', name: t('timeline.sown'), icon: '🌱' },
    { id: 'growing', name: t('timeline.growing'), icon: '🌿' },
    { id: 'harvested', name: t('timeline.harvested'), icon: '🌾' },
    { id: 'selling', name: t('timeline.selling'), icon: '💰' },
    { id: 'sold', name: t('timeline.sold'), icon: '✅' },
  ]

  const countByStage = (stage: string) => 
    crops.filter(crop => crop.stage.toLowerCase() === stage).length

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-primary-700 mb-4">
        {t('timeline.title')}
      </h3>
      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl mr-3">
              {stage.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-primary-700">
                  {stage.name}
                </span>
                <span className="text-sm font-bold text-primary-500">
                  {countByStage(stage.id)}
                </span>
              </div>
              <div className="w-full bg-primary-100 rounded-full h-2 mt-1">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{
                    width: `${(countByStage(stage.id) / crops.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}