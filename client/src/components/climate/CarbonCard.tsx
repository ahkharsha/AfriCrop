import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import ProgressRing from '../ui/ProgressRing'
import { type Farmer } from '@/types'
import { formatNumber } from '@/lib/utils'

interface CarbonCardProps {
  farmer: Farmer
  crops: {
    stage: string
    initialSeeds: bigint
    harvestedOutput: bigint
  }[]
}

export const CarbonCard: React.FC<CarbonCardProps> = ({ farmer, crops }) => {
  const t = useTranslations('Climate')

  // Calculate additional metrics from crops data
  const activeCrops = crops.filter(crop => 
    crop.stage !== 'CANCELLED' && crop.stage !== 'SOLD'
  ).length

  const totalSeeds = crops.reduce(
    (sum, crop) => sum + crop.initialSeeds, 
    BigInt(0)
  )

  const totalHarvest = crops.reduce(
    (sum, crop) => sum + (crop.harvestedOutput || BigInt(0)), 
    BigInt(0)
  )

  // Calculate efficiency (harvest/output ratio)
  const efficiency = totalSeeds > 0 
    ? Number(totalHarvest * BigInt(100) / totalSeeds) 
    : 0

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          {t('carbonTitle')}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Sustainability Score */}
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={Number(farmer.sustainabilityScore)}
              size={80}
              color="var(--color-primary-500)"
            />
            <span className="text-sm mt-2 text-center">
              {t('sustainabilityScore')}
            </span>
            <span className="text-xs text-secondary-500">
              {formatNumber(farmer.sustainabilityScore)} pts
            </span>
          </div>
          
          {/* Active Crops */}
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={(activeCrops / Math.max(crops.length, 1)) * 100}
              size={80}
              color="var(--color-green-500)"
            />
            <span className="text-sm mt-2 text-center">
              {t('activeCrops')}
            </span>
            <span className="text-xs text-secondary-500">
              {activeCrops}/{crops.length}
            </span>
          </div>
          
          {/* Harvest Efficiency */}
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={efficiency}
              size={80}
              color="var(--color-accent-500)"
            />
            <span className="text-sm mt-2 text-center">
              {t('harvestEfficiency')}
            </span>
            <span className="text-xs text-secondary-500">
              {efficiency}%
            </span>
          </div>
          
          {/* Carbon Impact (example calculation) */}
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={Number(farmer.sustainabilityScore) / 2} // Example metric
              size={80}
              color="var(--color-blue-500)"
            />
            <span className="text-sm mt-2 text-center">
              {t('carbonImpact')}
            </span>
            <span className="text-xs text-secondary-500">
              {formatNumber(BigInt(Number(farmer.sustainabilityScore) * 10))} kg CO₂
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}