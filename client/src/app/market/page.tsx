// src/app/market/page.tsx
'use client'

import { useReadContract, useAccount } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
import Card from '@/components/Card'
import { ShoppingBag, Filter } from 'lucide-react'

export default function MarketPage() {
  const { address } = useAccount()
  const t = useTranslations()
  
  const { data: listings } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getActiveMarketListings',
  }) as { data: any[] | undefined }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Marketplace</h1>
              <p className="text-secondary-600 mt-2">
                Buy and sell agricultural products directly
              </p>
            </div>
            <button className="btn btn-outline flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {listings?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.listingId.toString()} listing={listing} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <ShoppingBag className="w-12 h-12 mx-auto text-secondary-400" />
              <h3 className="text-xl font-semibold mt-4">No listings available</h3>
              <p className="text-secondary-600 mt-2">
                There are currently no crops listed for sale
              </p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}