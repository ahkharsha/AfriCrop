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

  // Cast to array of bigints with fallback
  const listingIds = (activeListingIds as bigint[] | undefined) ?? []

  const listingQueries = listingIds.map((id) => 
    useReadContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'marketListings',
      args: [id],
      query: {
        enabled: !!activeListingIds,
      },
    })
  )

  const isLoading = isLoadingIds || listingQueries.some(q => q.isLoading)
  
  // Type-safe mapping of query results
  const listings = listingQueries
    .map(q => q.data)
    .filter((listing): listing is MarketListing => !!listing)

  return {
    listings,
    isLoading,
  }
}