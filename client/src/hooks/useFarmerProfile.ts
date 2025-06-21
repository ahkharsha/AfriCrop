import { useContractRead, useAccount } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { useChainCheck } from './useChainCheck'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useFarmerProfile = () => {
  const { address } = useAccount()
  const { isCorrectChain } = useChainCheck()

  const { data: farmer, isLoading } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'farmers',
    args: [address],
    enabled: !!address && isCorrectChain,
  })

  return {
    farmer: farmer || {
      walletAddress: address,
      reputationPoints: 0,
      sustainabilityScore: 0,
      knowledgePoints: 0,
      harvestPoints: 0,
      isRegistered: false,
    },
    isLoading,
    error: null,
  }
}