// hooks/useMarketplace.ts
import { useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { Address } from 'viem'
import { type MarketListing } from '@/types'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export function useMarketplace() {
  const { data: activeListings } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getActiveMarketListings',
  })

  const { data: listings } = useReadContract({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'getListingsBatch',
    args: [activeListings || []],
  })

  return {
    listings: (listings || []) as MarketListing[],
    isLoading: false,
    error: null,
  }
}