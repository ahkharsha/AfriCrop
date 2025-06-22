// hooks/useCrops.ts
import { useReadContract, useAccount } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { useChainCheck } from './useChainCheck'
import { type Crop } from '@/types'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useCrops = () => {
  const { address } = useAccount()
  const { isCorrectChain } = useChainCheck()

  const { data: farmerCrops } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getFarmerCrops',
    args: [address],
  })

  const { data: crops } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getCropsBatch',
    args: [farmerCrops || []],
  })

  return {
    crops: (crops || []) as Crop[],
    isLoading: false,
    error: null,
  }
}