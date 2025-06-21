import { useContractRead, useAccount } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { useChainCheck } from './useChainCheck'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useCrops = () => {
  const { address } = useAccount()
  const { isCorrectChain } = useChainCheck()

  const { data: farmerCrops, isLoading: isLoadingCrops } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getFarmerCrops',
    args: [address],
    enabled: !!address && isCorrectChain,
  })

  const { data: crops, isLoading: isLoadingCropDetails } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getCropsBatch',
    args: [farmerCrops || []],
    enabled: !!farmerCrops && isCorrectChain,
  })

  return {
    crops: crops || [],
    isLoading: isLoadingCrops || isLoadingCropDetails,
    error: null,
  }
}