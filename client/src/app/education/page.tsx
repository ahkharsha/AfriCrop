'use client'

import { useEducation } from '@/hooks/useEducation'
import { LessonCard } from '@/components/education/LessonCard'
import { Skeleton } from '@/components/ui/skeleton'
import { type Lesson } from '@/types' // Import the Lesson type

export default function EducationPage() {
  const { lessons, isLoading } = useEducation()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Farmer Education</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))
        ) : lessons.map((lesson: Lesson) => ( // Explicitly type the lesson parameter
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  )
}