// hooks/useClimate.ts
import { useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useClimate = () => {
  const { data: leaderboard } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getSustainabilityLeaderboard',
  })

  return {
    leaderboard: leaderboard || [],
    isLoading: false,
    error: null,
  }
}