import { Card } from '@/components/ui/card'

type StatCardProps = {
  title: string
  value: number
  icon: React.ReactNode
  color: string
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className="p-6 flex-1 min-w-[200px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div 
          className={`p-3 rounded-full ${color} text-white`}
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}

type StatsCardsProps = {
  reputation: number
  sustainability: number
  knowledge: number
  harvest: number
}

export function StatsCards({
  reputation,
  sustainability,
  knowledge,
  harvest,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Reputation"
        value={reputation}
        icon={<span>R</span>}
        color="var(--primary-green)"
      />
      <StatCard
        title="Sustainability"
        value={sustainability}
        icon={<span>S</span>}
        color="var(--sustainability-accent)"
      />
      <StatCard
        title="Knowledge"
        value={knowledge}
        icon={<span>K</span>}
        color="var(--secondary-brown)"
      />
      <StatCard
        title="Harvest"
        value={harvest}
        icon={<span>H</span>}
        color="var(--warning-accent)"
      />
    </div>
  )
}