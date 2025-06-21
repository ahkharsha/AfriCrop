import { useContractRead, useAccount } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { useChainCheck } from './useChainCheck'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useGovernance = () => {
  const { address } = useAccount()
  const { isCorrectChain } = useChainCheck()

  const { data: proposals, isLoading } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getAllProposals',
    enabled: isCorrectChain,
  })

  const { data: votingPower } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'calculateVotingPower',
    args: [address],
    enabled: !!address && isCorrectChain,
  })

  return {
    proposals: proposals || [],
    votingPower: votingPower ? Number(votingPower) : 0,
    isLoading,
    error: null,
  }
}