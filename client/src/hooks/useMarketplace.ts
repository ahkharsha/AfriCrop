import { useContractRead } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { useChainCheck } from './useChainCheck'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useMarketplace = () => {
  const { isCorrectChain } = useChainCheck()

  const { data: activeListings, isLoading: isLoadingListings } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getActiveMarketListings',
    enabled: isCorrectChain,
  })

  const { data: listings, isLoading: isLoadingListingDetails } = useContractRead({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getListingsBatch',
    args: [activeListings || []],
    enabled: !!activeListings && isCorrectChain,
  })

  return {
    listings: listings || [],
    isLoading: isLoadingListings || isLoadingListingDetails,
    error: null,
  }
}