import React from 'react'
import { useTranslations } from 'next-intl'
import { Farmer } from '@/types'

const getLeague = (reputation: number) => {
  if (reputation >= 800) return 'master'
  if (reputation >= 600) return 'diamond'
  if (reputation >= 400) return 'platinum'
  if (reputation >= 200) return 'gold'
  return 'bronze'
}

const leagueColors = {
  master: 'bg-gradient-to-r from-purple-600 to-pink-500',
  diamond: 'bg-gradient-to-r from-blue-500 to-teal-400',
  platinum: 'bg-gradient-to-r from-gray-400 to-gray-300',
  gold: 'bg-gradient-to-r from-yellow-500 to-yellow-300',
  bronze: 'bg-gradient-to-r from-amber-700 to-amber-500',
}

const LeagueBadge: React.FC<{ farmer: Farmer }> = ({ farmer }) => {
  const t = useTranslations('Dashboard')
  const league = getLeague(farmer.reputationPoints)

  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${leagueColors[league]}`}
      >
        {t(`leagues.${league}`).charAt(0)}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-primary-800">
          {t(`leagues.${league}`)}
        </h3>
        <p className="text-sm text-secondary-600">
          {t('leagueProgress', {
            progress: Math.min(
              Math.floor((farmer.reputationPoints / 1000) * 100),
              100
            ),
          })}
        </p>
      </div>
    </div>
  )
}

export default LeagueBadge