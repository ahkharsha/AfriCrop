import React from 'react'
import { useTranslations } from 'next-intl'
import { Activity } from 'lucide-react'
import { Card } from '../ui/Card'

const activities = [
  { type: 'crop_sown', date: '2023-11-15', crop: 'Maize' },
  { type: 'lesson_completed', date: '2023-11-14', lesson: 'Sustainable Farming' },
  { type: 'crop_harvested', date: '2023-11-12', crop: 'Rice' },
  { type: 'proposal_voted', date: '2023-11-10', proposal: 'New Irrigation System' },
]

export const RecentActivity: React.FC = () => {
  const t = useTranslations('Dashboard')

  const getActivityText = (activity: typeof activities[0]) => {
    switch (activity.type) {
      case 'crop_sown':
        return t('activity.sown', { crop: activity.crop })
      case 'lesson_completed':
        return t('activity.lesson', { lesson: activity.lesson })
      case 'crop_harvested':
        return t('activity.harvested', { crop: activity.crop })
      case 'proposal_voted':
        return t('activity.voted', { proposal: activity.proposal })
      default:
        return ''
    }
  }

  return (
    <Card title={t('recentActivity')} padding="md">
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-1 mr-3 text-accent-500">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-primary-700">
                {getActivityText(activity)}
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                {new Date(activity.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}