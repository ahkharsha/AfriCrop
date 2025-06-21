import { type Crop } from '@/types'
import { Button } from '../ui/button'
import Link from 'next/link'
import { CropStageIndicator } from './CropStageIndicator'
import { cn } from '@/lib/utils'

const cropTypeNames = [
  'Maize', 'Rice', 'Wheat', 'Cassava', 'Beans', 
  'Sorghum', 'Millet', 'Yam', 'Potatoes', 'Coffee', 'Cotton'
]

export function CropCard({ crop }: { crop: Crop }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">
            {cropTypeNames[crop.cropType] || 'Unknown Crop'}
          </h3>
          <CropStageIndicator stage={crop.stage} />
        </div>

        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">
            Farm ID: <span className="font-medium">{crop.farmId}</span>
          </p>
          <p className="text-muted-foreground">
            Seeds: <span className="font-medium">{crop.initialSeeds.toString()}</span>
          </p>
          {crop.harvestedOutput > 0 && (
            <p className="text-muted-foreground">
              Harvested: <span className="font-medium">{crop.harvestedOutput.toString()}</span>
            </p>
          )}
        </div>

        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/crops/${crop.id}`}>Details</Link>
          </Button>
          {crop.stage === 2 && (
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/marketplace/list?cropId=${crop.id}`}>Sell</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}