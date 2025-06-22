// components/education/LessonCard.tsx
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { type Lesson } from '@/types'
import { BookOpen } from 'lucide-react'

interface LessonCardProps {
  lesson: Lesson
  completed?: boolean // Make optional since it's not in the contract
}

export const LessonCard: React.FC<LessonCardProps> = ({ 
  lesson,
  completed = false // Default value
}) => {
  const t = useTranslations('Education')

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-primary-700">
            Lesson #{lesson.id.toString()}
          </h3>
          {completed && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {t('completed')}
            </span>
          )}
        </div>

        <p className="text-sm text-secondary-600">
          IPFS: {lesson.ipfsHash.slice(0, 12)}...{lesson.ipfsHash.slice(-4)}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-accent-500">
            +{lesson.knowledgePointsReward.toString()} {t('points')}
          </span>
          <Button variant={completed ? 'outline' : 'accent'} size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            {completed ? t('viewAgain') : t('start')}
          </Button>
        </div>
      </div>
    </Card>
  )
}