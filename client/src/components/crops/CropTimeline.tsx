import { cn } from '@/lib/utils'

const stages = [
  { name: 'Sown', description: 'Seeds planted in the field' },
  { name: 'Growing', description: 'Crops developing in the field' },
  { name: 'Harvested', description: 'Crops harvested from the field' },
  { name: 'Selling', description: 'Crops listed on marketplace' },
  { name: 'Sold', description: 'Crops transferred to buyer' },
]

export function CropTimeline({
  stage,
  sownDate,
  harvestedDate,
}: {
  stage: number
  sownDate: Date
  harvestedDate: Date | null
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Crop Timeline</h2>
      <div className="space-y-2">
        {stages.map((s, i) => (
          <div key={s.name} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 mt-1',
                  i <= stage ? 'bg-primary-green border-primary-green' : 'bg-white border-gray-300',
                  i === stage ? 'ring-2 ring-primary-green/50' : ''
                )}
              />
              {i < stages.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-8',
                    i < stage ? 'bg-primary-green' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className={cn(
                'font-medium',
                i <= stage ? 'text-primary-green' : 'text-muted-foreground'
              )}>
                {s.name}
              </h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
              {i === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {sownDate.toLocaleDateString()}
                </p>
              )}
              {i === 2 && harvestedDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  {harvestedDate.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}