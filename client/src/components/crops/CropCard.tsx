import React from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Crop } from '@/types'
import { Sprout, ArrowRight, Harvest } from 'lucide-react'

interface CropCardProps {
  crop: Crop
}

export const CropCard: React.FC<CropCardProps> = ({ crop }) => {
  const t = useTranslations('Crops')
  
  const getStageColor = () => {
    switch (crop.stage) {
      case 'SOWN': return 'bg-blue-100 text-blue-800'
      case 'GROWING': return 'bg-green-100 text-green-800'
      case 'HARVESTED': return 'bg-yellow-100 text-yellow-800'
      case 'SELLING': return 'bg-purple-100 text-purple-800'
      case 'SOLD': return 'bg-gray-100 text-gray-800'
      default: return 'bg-primary-100 text-primary-800'
    }
  }

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-primary-700">
              {t(`cropTypes.${crop.cropType}`)}
            </h3>
            <p className="text-sm text-secondary-500">{crop.farmId}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor()}`}>
            {t(`stages.${crop.stage.toLowerCase()}`)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-secondary-500">{t('sown')}</p>
            <p className="font-medium">
              {new Date(crop.sownTimestamp * 1000).toLocaleDateString()}
            </p>
          </div>
          {crop.harvestedTimestamp && (
            <div>
              <p className="text-secondary-500">{t('harvested')}</p>
              <p className="font-medium">
                {new Date(crop.harvestedTimestamp * 1000).toLocaleDateString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-secondary-500">{t('initialSeeds')}</p>
            <p className="font-medium">{crop.initialSeeds}</p>
          </div>
          {crop.harvestedOutput && (
            <div>
              <p className="text-secondary-500">{t('harvestedOutput')}</p>
              <p className="font-medium">{crop.harvestedOutput}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          {crop.stage === 'GROWING' && (
            <Button variant="outline" size="sm">
              <Harvest className="mr-2 h-4 w-4" />
              {t('harvest')}
            </Button>
          )}
          <Button variant="outline" size="sm">
            <ArrowRight className="mr-2 h-4 w-4" />
            {t('view')}
          </Button>
        </div>
      </div>
    </Card>
  )
}