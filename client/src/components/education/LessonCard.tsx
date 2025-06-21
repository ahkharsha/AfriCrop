import { type Lesson } from '@/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LessonCard({ 
  lesson, 
  completed 
}: { 
  lesson: Lesson
  completed?: boolean
}) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">Lesson #{lesson.id.toString()}</h3>
          {completed && (
            <span className="flex items-center text-sm text-green-500">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Completed
            </span>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-sm line-clamp-2">
            IPFS Content: {lesson.ipfsHash}
          </p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-green/10 text-primary-green">
              {lesson.knowledgePointsReward.toString()} KP
            </span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/education/lessons/${lesson.id}`}>
            {completed ? 'Review Lesson' : 'Start Lesson'}
          </Link>
        </Button>
      </div>
    </div>
  )
}