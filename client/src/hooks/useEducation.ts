// hooks/useEducation.ts
import { useReadContract, useAccount } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { type Lesson, type MentorshipSession } from '@/types'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useEducation = () => {
  const { address } = useAccount()

  const { data: lessons } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getAllLessons',
  })

  const { data: completedLessons } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getCompletedLessons',
    args: [address],
  })

  const { data: mentorships } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getMentorships',
    args: [address],
  })

  return {
    lessons: (lessons || []) as Lesson[],
    mentorships: (mentorships || []) as MentorshipSession[],
    isLoading: false,
    error: null,
  }
}