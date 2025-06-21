import React from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { BookOpen } from 'lucide-react'

interface LessonCardProps {
  lesson: {
    id: number
    title: string
    description: string
    points: number
    completed: boolean
  }
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  const t = useTranslations('Education')

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-primary-700">
            {lesson.title}
          </h3>
          {lesson.completed && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {t('completed')}
            </span>
          )}
        </div>

        <p className="text-sm text-secondary-600">{lesson.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-accent-500">
            +{lesson.points} {t('points')}
          </span>
          <Button variant={lesson.completed ? 'outline' : 'accent'} size="sm">
            <BookOpen className="mr-2 h-4 w-4" />
            {lesson.completed ? t('viewAgain') : t('start')}
          </Button>
        </div>
      </div>
    </Card>
  )
}