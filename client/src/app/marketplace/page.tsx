import { useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { type MarketListing } from '@/types'

export function useMarketplace() {
  const { 
    data: activeListingIds, 
    isLoading: isLoadingIds 
  } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'getActiveMarketListings',
  })

  // Type guard to ensure activeListingIds is an array of bigints
  const listingIds = Array.isArray(activeListingIds) 
    ? activeListingIds.filter((id): id is bigint => typeof id === 'bigint')
    : []

  const listingQueries = listingIds.map((id) => 
    useReadContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'marketListings',
      args: [id],
      query: {
        enabled: listingIds.length > 0,
      },
    })
  )

  const isLoading = isLoadingIds || listingQueries.some(q => q.isLoading)
  
  // Ensure proper typing of the listings array
  const listings = listingQueries
    .map(q => q.data)
    .filter((listing): listing is MarketListing => listing !== undefined)

  return {
    listings,
    isLoading,
  }
}