import { useContractRead, useAccount } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { useChainCheck } from './useChainCheck'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useClimate = () => {
  const { address } = useAccount()
  const { isCorrectChain } = useChainCheck()

  const { data: climateData } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getClimateData',
    args: [address],
    enabled: !!address && isCorrectChain,
  })

  const { data: leaderboard } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getSustainabilityLeaderboard',
    enabled: isCorrectChain,
  })

  return {
    carbonData: climateData || {
      carbonSequestration: 0,
      waterSaved: 0,
      biodiversityScore: 0,
      sustainabilityScore: 0,
      monthlyImpact: [],
    },
    leaderboard: leaderboard || [],
    isLoading: false,
    error: null,
  }
}