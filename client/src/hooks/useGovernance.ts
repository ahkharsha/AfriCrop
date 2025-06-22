// hooks/useGovernance.ts
import { useReadContract, useAccount } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { useChainCheck } from './useChainCheck'
import { type Proposal } from '@/types'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useGovernance = () => {
  const { address } = useAccount()
  const { isCorrectChain } = useChainCheck()

  const { data: proposals, isLoading: isLoadingProposals } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getAllProposals',
    query: {
      select: (data: unknown) => data as Proposal[],
    }
  })

  const { data: votingPower, isLoading: isLoadingVotingPower } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'calculateVotingPower',
    args: [address],
    query: {
      select: (data: unknown) => data as bigint,
      enabled: !!address
    }
  })

  return {
    proposals: proposals || [],
    votingPower: votingPower || BigInt(0),
    isLoading: isLoadingProposals || isLoadingVotingPower,
    error: null,
  }
}