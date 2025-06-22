// components/climate/Leaderboard.tsx
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Table } from '../ui/Table'

interface LeaderboardProps {
  data: {
    farmer: string
    score: bigint
  }[]
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const t = useTranslations('Climate')

  const columns = [
    { key: 'rank', header: t('rank') },
    { key: 'farmer', header: t('farmer') },
    { key: 'score', header: t('score') },
  ]

  const rankedData = data
    .map((item, index) => ({
      rank: index + 1,
      farmer: item.farmer,
      score: Number(item.score),
    }))
    .sort((a, b) => b.score - a.score)

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          {t('leaderboard')}
        </h3>
        <Table 
          columns={columns} 
          data={rankedData.slice(0, 5)} // Show top 5
        />
      </div>
    </Card>
  )
}