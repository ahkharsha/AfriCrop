// src/app/market/page.tsx (1)
'use client'

import { useReadContract, useAccount, useWriteContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
import Card from '@/components/Card'
import { ShoppingBag, Filter } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { ConnectKitButton } from 'connectkit'

export default function MarketPage() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  const t = useTranslations()
  const [loading, setLoading] = useState<{[key: string]: boolean}>({})
  
  const { data: listings } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getActiveMarketListings',
  }) as { data: any[] | undefined }

  const purchaseCrop = async (listingId: bigint, price: bigint) => {
    setLoading(prev => ({...prev, [listingId.toString()]: true}))
    
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'purchaseCrop',
      args: [listingId],
      value: price,
    }, {
      onSuccess: () => {
        toast.success('Crop purchased successfully!')
      },
      onError: (error) => {
        toast.error(`Purchase failed: ${error.message}`)
      },
      onSettled: () => {
        setLoading(prev => ({...prev, [listingId.toString()]: false}))
      }
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <Card className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-secondary-600 mb-6">
              Please connect your wallet to access the marketplace
            </p>
            <ConnectKitButton.Custom>
              {({ show }) => (
                <button 
                  onClick={show}
                  className="btn btn-primary"
                >
                  Connect Wallet
                </button>
              )}
            </ConnectKitButton.Custom>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-8">
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
                <ListingCard 
                  key={listing.listingId.toString()}
                  listing={listing}
                  onPurchase={() => purchaseCrop(listing.listingId, listing.priceInWei)}
                  loading={loading[listing.listingId.toString()] || false}
                />
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