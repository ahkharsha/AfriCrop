// hooks/useFarmerProfile.ts
import { useReadContract, useAccount } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { type Farmer } from '@/types'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useFarmerProfile = () => {
  const { address } = useAccount()

  const { data } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'farmers',
    args: [address],
  })

  // Cast the returned data to our Farmer type
  const farmer = data as unknown as Farmer | null

  return {
    farmer: farmer ? {
      walletAddress: farmer.walletAddress,
      reputationPoints: farmer.reputationPoints,
      sustainabilityScore: farmer.sustainabilityScore,
      knowledgePoints: farmer.knowledgePoints,
      harvestPoints: farmer.harvestPoints,
      lastProposalStakeTime: farmer.lastProposalStakeTime,
      isRegistered: farmer.isRegistered,
    } : null,
    isLoading: false,
    error: null,
  }
}