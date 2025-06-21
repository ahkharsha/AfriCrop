import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MentorshipSession } from '@/types'

export function MentorshipCard({
  session,
  isMentor,
}: {
  session: MentorshipSession
  isMentor: boolean
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          {isMentor ? 'Mentee: ' : 'Mentor: '}
          <span className="font-mono text-sm">
            {isMentor ? session.mentee : session.mentor}
          </span>
        </h3>
        <span className={cn(
          'text-xs px-2 py-1 rounded-full',
          session.completed ? 'bg-green-100 text-green-800' :
          session.accepted ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        )}>
          {session.completed ? 'Completed' : session.accepted ? 'Active' : 'Pending'}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Started: {session.startTimestamp ? 
            new Date(Number(session.startTimestamp) * 1000).toLocaleDateString() : 
            'Not started'}
        </span>
      </div>

      <Button variant="outline" size="sm" asChild className="w-full">
        <Link href={`/education/mentorship/${session.id}`}>
          View Session
        </Link>
      </Button>
    </div>
  )
}