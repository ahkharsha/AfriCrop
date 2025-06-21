'use client'

import { useParams } from 'next/navigation'
import { useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

interface MentorshipSession {
  id: bigint
  mentor: `0x${string}`
  mentee: `0x${string}`
  accepted: boolean
  completed: boolean
  startTimestamp: bigint
  endTimestamp: bigint
}

export default function MentorshipPage() {
  const { id } = useParams()
  const { address } = useAccount()
  
  const { data: session, isLoading } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'mentorshipSessions',
    args: [BigInt(id as string)],
  }) as { data: MentorshipSession | undefined, isLoading: boolean }

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Mentorship updated',
          description: 'Session status has been changed',
        })
      },
      onError: (error) => {
        toast({
          title: 'Error updating session',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  })

  const acceptSession = () => {
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'acceptMentorship',
      args: [BigInt(id as string)],
    })
  }

  const completeSession = () => {
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'completeMentorship',
      args: [BigInt(id as string)],
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  if (!session) {
    return <div className="text-center py-12">Session not found</div>
  }

  const isMentor = address === session.mentor
  const isMentee = address === session.mentee
  const canComplete = (isMentor || isMentee) && session.accepted && !session.completed

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Mentorship Session #{id}</h1>
        <p className="text-muted-foreground">
          {session.completed ? 'Completed' : session.accepted ? 'Active' : 'Pending'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Mentor</h3>
          <p className="mt-1 font-mono">{session.mentor}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Mentee</h3>
          <p className="mt-1 font-mono">{session.mentee}</p>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-2">
        <h3 className="font-medium">Session Timeline</h3>
        <p className="text-sm">
          <span className="font-medium">Started:</span> {session.startTimestamp ? 
            new Date(Number(session.startTimestamp) * 1000).toLocaleDateString() : 
            'Not started'}
        </p>
        <p className="text-sm">
          <span className="font-medium">Completed:</span> {session.endTimestamp ? 
            new Date(Number(session.endTimestamp) * 1000).toLocaleDateString() : 
            'Not completed'}
        </p>
      </div>

      {isMentor && !session.accepted && (
        <Button 
          onClick={acceptSession} 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Accepting...' : 'Accept Mentorship'}
        </Button>
      )}

      {canComplete && (
        <Button 
          onClick={completeSession} 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Completing...' : 'Complete Session'}
        </Button>
      )}
    </div>
  )
}