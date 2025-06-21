'use client'

import { useParams } from 'next/navigation'
import { useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts'
import { AFRICROP_DAO_ADDRESS, IPFS_GATEWAY } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { toast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

type Lesson = {
  id: bigint
  ipfsHash: string
  knowledgePointsReward: bigint
}

export default function LessonPage() {
  const { id } = useParams()
  const { address } = useAccount()
  
  const { data: lesson, isLoading } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'lessons',
    args: [BigInt(id as string)],
  }) as { 
    data: Lesson | undefined
    isLoading: boolean 
  }

  const { data: isCompleted } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'completedLessons',
    args: [address || '0x', BigInt(id as string)],
    query: {
      enabled: !!address,
    },
  }) as {
    data: boolean | undefined
  }

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Lesson completed',
          description: 'You have earned knowledge points',
        })
      },
      onError: (error) => {
        toast({
          title: 'Error completing lesson',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  })

  const completeLesson = () => {
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'completeLesson',
      args: [BigInt(id as string)],
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-64 w-full mt-4" />
      </div>
    )
  }

  if (!lesson) {
    return <div className="text-center py-12">Lesson not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Lesson #{id}</h1>
        <p className="text-muted-foreground">
          Knowledge Points: {lesson.knowledgePointsReward.toString()}
        </p>
      </div>

      <div className="border rounded-lg p-4">
        <iframe 
          src={`${IPFS_GATEWAY}/${lesson.ipfsHash}`}
          className="w-full h-96 border-0 rounded"
          title="Lesson Content"
        />
      </div>

      {!isCompleted ? (
        <Button 
          onClick={completeLesson} 
          disabled={isPending}
          className="w-full"
        >
          {isPending ? 'Completing...' : 'Mark as Completed'}
        </Button>
      ) : (
        <div className="text-center py-4 text-green-500">
          You have completed this lesson
        </div>
      )}
    </div>
  )
}