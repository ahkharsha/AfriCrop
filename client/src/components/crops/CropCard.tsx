import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { type Crop } from '@/types'
import { formatDate } from '@/lib/utils'
import { Sprout, ArrowRight, Wheat } from 'lucide-react'

interface CropCardProps {
  crop: Crop
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'SOWN': return 'bg-blue-100 text-blue-800'
    case 'GROWING': return 'bg-green-100 text-green-800'
    case 'HARVESTED': return 'bg-yellow-100 text-yellow-800'
    case 'SELLING': return 'bg-purple-100 text-purple-800'
    case 'SOLD': return 'bg-gray-100 text-gray-800'
    default: return 'bg-primary-100 text-primary-800'
  }
}

export const CropCard: React.FC<CropCardProps> = ({ crop }) => {
  const t = useTranslations('Crops')
  const sownDate = formatDate(crop.sownTimestamp)
  const harvestedDate = crop.harvestedTimestamp > BigInt(0) ? 
    formatDate(crop.harvestedTimestamp) : null

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-primary-700">
              {t(`cropTypes.${crop.cropType.toLowerCase()}`)}
            </h3>
            <p className="text-sm text-secondary-500">{crop.farmId}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            getStageColor(crop.stage)
          }`}>
            {t(`stages.${crop.stage.toLowerCase()}`)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-secondary-500">{t('sown')}</p>
            <p className="font-medium">{sownDate}</p>
          </div>
          {harvestedDate && (
            <div>
              <p className="text-secondary-500">{t('harvested')}</p>
              <p className="font-medium">{harvestedDate}</p>
            </div>
          )}
          <div>
            <p className="text-secondary-500">{t('initialSeeds')}</p>
            <p className="font-medium">{crop.initialSeeds.toString()}</p>
          </div>
          {crop.harvestedOutput > BigInt(0) && (
            <div>
              <p className="text-secondary-500">{t('harvestedOutput')}</p>
              <p className="font-medium">{crop.harvestedOutput.toString()}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          {crop.stage === 'GROWING' && (
            <Button variant="outline" size="sm">
              <Wheat className="mr-2 h-4 w-4" />
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