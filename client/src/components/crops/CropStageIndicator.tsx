import { type CropStage } from '@/lib/contracts/enums'
import { cn } from '@/lib/utils'

const stageNames = ['Sown', 'Growing', 'Harvested', 'Selling', 'Sold', 'Cancelled']
const stageColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-gray-100 text-gray-800',
  'bg-red-100 text-red-800',
]

export function CropStageIndicator({ stage }: { stage: CropStage }) {
  return (
    <span className={cn(
      'text-xs px-2 py-1 rounded-full',
      stageColors[stage]
    )}>
      {stageNames[stage]}
    </span>
  )
}