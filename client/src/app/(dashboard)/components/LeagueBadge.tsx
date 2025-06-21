import { cn } from '@/lib/utils'

const leagues = [
  { name: 'Bronze', min: 0, max: 299, color: 'bg-amber-600' },
  { name: 'Silver', min: 300, max: 599, color: 'bg-gray-300' },
  { name: 'Gold', min: 600, max: 899, color: 'bg-yellow-400' },
  { name: 'Platinum', min: 900, max: 1199, color: 'bg-teal-400' },
  { name: 'Master', min: 1200, max: Infinity, color: 'bg-purple-500' },
]

export function LeagueBadge({
  reputation,
  className,
}: {
  reputation: number
  className?: string
}) {
  const currentLeague = leagues.find(
    (league) => reputation >= league.min && reputation <= league.max
  ) || leagues[0]

  return (
    <div className={cn(
      'w-fit px-4 py-2 rounded-full text-white font-bold flex items-center space-x-2',
      currentLeague.color,
      className
    )}>
      <span>{currentLeague.name}</span>
      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
        {reputation} RP
      </span>
    </div>
  )
}