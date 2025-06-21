import React from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { User, Calendar, Check } from 'lucide-react'

interface MentorshipCardProps {
  mentorship: {
    id: number
    mentor: string
    mentee: string
    status: 'pending' | 'active' | 'completed'
    startDate?: string
    endDate?: string
  }
  isMentor: boolean
}

export const MentorshipCard: React.FC<MentorshipCardProps> = ({
  mentorship,
  isMentor,
}) => {
  const t = useTranslations('Education')

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-primary-700">
            #{mentorship.id} - {t('mentorship')}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded ${
              mentorship.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : mentorship.status === 'active'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {t(`status.${mentorship.status}`)}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4 text-secondary-500" />
          <span className="text-secondary-500">
            {isMentor ? t('mentee') : t('mentor')}:
          </span>
          <span className="font-medium">
            {isMentor ? mentorship.mentee : mentorship.mentor}
          </span>
        </div>

        {mentorship.startDate && (
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-secondary-500" />
            <span className="text-secondary-500">{t('startDate')}:</span>
            <span className="font-medium">{mentorship.startDate}</span>
          </div>
        )}

        {mentorship.status === 'pending' && isMentor && (
          <div className="flex space-x-2">
            <Button variant="accent" size="sm">
              {t('accept')}
            </Button>
            <Button variant="outline" size="sm">
              {t('decline')}
            </Button>
          </div>
        )}

        {mentorship.status === 'active' && (
          <Button variant="accent" size="sm">
            <Check className="mr-2 h-4 w-4" />
            {t('complete')}
          </Button>
        )}
      </div>
    </Card>
  )
}