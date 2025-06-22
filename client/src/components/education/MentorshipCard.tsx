// components/education/MentorshipCard.tsx
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { type MentorshipSession } from '@/types'
import { User, Calendar, Check } from 'lucide-react'
import { useAccount } from 'wagmi'
import { formatDate } from '@/lib/utils'

interface MentorshipCardProps {
  mentorship: MentorshipSession
}

export const MentorshipCard: React.FC<MentorshipCardProps> = ({ mentorship }) => {
  const t = useTranslations('Education')
  const { address } = useAccount()
  const isMentor = address?.toLowerCase() === mentorship.mentor.toLowerCase()

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-primary-700">
            Mentorship #{mentorship.id.toString()}
          </h3>
          <span className={`text-xs px-2 py-1 rounded ${
            mentorship.completed
              ? 'bg-green-100 text-green-800'
              : mentorship.accepted
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {mentorship.completed 
              ? t('status.completed')
              : mentorship.accepted
              ? t('status.active')
              : t('status.pending')}
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

        {mentorship.startTimestamp > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-secondary-500" />
            <span className="text-secondary-500">{t('startDate')}:</span>
            <span className="font-medium">
              {formatDate(mentorship.startTimestamp)}
            </span>
          </div>
        )}

        {!mentorship.accepted && isMentor && (
          <div className="flex space-x-2">
            <Button variant="accent" size="sm">
              {t('accept')}
            </Button>
            <Button variant="outline" size="sm">
              {t('decline')}
            </Button>
          </div>
        )}

        {mentorship.accepted && !mentorship.completed && (
          <Button variant="accent" size="sm">
            <Check className="mr-2 h-4 w-4" />
            {t('complete')}
          </Button>
        )}
      </div>
    </Card>
  )
}