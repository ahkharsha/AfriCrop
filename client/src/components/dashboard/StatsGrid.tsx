// components/dashboard/StatsGrid.tsx
import { useTranslations } from 'next-intl'
import { type Farmer } from '@/types'
import { Card } from '../ui/Card'
import ProgressRing from '../ui/ProgressRing'

interface StatsGridProps {
  farmer: Farmer
}

export const StatsGrid: React.FC<StatsGridProps> = ({ farmer }) => {
  const t = useTranslations('Dashboard')

  const stats = [
    {
      title: t('reputation'),
      value: Number(farmer.reputationPoints),
      max: 1000,
      description: t('reputationDesc'),
    },
    {
      title: t('sustainability'),
      value: Number(farmer.sustainabilityScore),
      max: 100,
      description: t('sustainabilityDesc'),
    },
    {
      title: t('knowledge'),
      value: Number(farmer.knowledgePoints),
      max: 500,
      description: t('knowledgeDesc'),
    },
    {
      title: t('harvest'),
      value: Number(farmer.harvestPoints),
      max: 1000,
      description: t('harvestDesc'),
    },
  ]

  return (
    <Card title={t('statsTitle')} padding="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <ProgressRing
              progress={(stat.value / stat.max) * 100}
              size={100}
              strokeWidth={8}
            />
            <h4 className="mt-4 font-semibold text-primary-700">{stat.title}</h4>
            <p className="text-sm text-secondary-600 mt-1">
              {stat.value} / {stat.max}
            </p>
            <p className="text-xs text-secondary-500 mt-2">{stat.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}