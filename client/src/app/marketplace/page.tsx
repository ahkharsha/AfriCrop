import { useTranslations } from 'next-intl'
import { ListingCard } from '@/components/marketplace/ListingCard'
import { useMarketplace } from '@/hooks/useMarketplace'
import { useChainCheck } from '@/hooks/useChainCheck'
import { FilterBar } from '@/components/marketplace/FilterBar'
import { type MarketListing } from '@/types'

export default function MarketplacePage() {
  const t = useTranslations('Marketplace')
  const { isConnected, isCorrectChain } = useChainCheck()
  const { listings, isLoading, error } = useMarketplace()

  const handleFilterChange = (filters: {
    cropType: string
    minPrice: number
    maxPrice: number
  }) => {
    // Implement your filter logic here
    console.log('Filters changed:', filters)
  }

  if (!isConnected || !isCorrectChain) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">{t('connectWallet')}</h2>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <p className="text-red-500">{t('errorLoading')}</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-700">{t('title')}</h1>
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing: MarketListing) => (
          <ListingCard key={listing.listingId.toString()} listing={listing} />
        ))}
      </div>
    </div>
  )
}