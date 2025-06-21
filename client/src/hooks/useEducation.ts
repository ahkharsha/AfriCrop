import { useContractRead, useAccount } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { useChainCheck } from './useChainCheck'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useEducation = () => {
  const { address } = useAccount()
  const { isCorrectChain } = useChainCheck()

  const { data: lessons } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getAllLessons',
    enabled: isCorrectChain,
  })

  const { data: completedLessons } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getCompletedLessons',
    args: [address],
    enabled: !!address && isCorrectChain,
  })

  const { data: mentorships } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getMentorships',
    args: [address],
    enabled: !!address && isCorrectChain,
  })

  return {
    lessons: lessons || [],
    mentorships: mentorships || [],
    isLoading: false,
    error: null,
  }
}