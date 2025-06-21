import React from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Table } from '../ui/Table'

interface LeaderboardProps {
  data: {
    rank: number
    farmer: string
    score: number
  }[]
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ data }) => {
  const t = useTranslations('Climate')

  const columns = [
    { key: 'rank', header: t('rank') },
    { key: 'farmer', header: t('farmer') },
    { key: 'score', header: t('score') },
  ]

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          {t('leaderboard')}
        </h3>
        <Table columns={columns} data={data} />
      </div>
    </Card>
  )
}