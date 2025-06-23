// src/components/ListingCard.tsx (1)
'use client'

import { useTranslations } from '../utils/i18n'
import Image from 'next/image'
import { ShoppingCart, Loader2 } from 'lucide-react'

type Listing = {
  listingId: bigint
  cropId: bigint
  seller: string
  priceInWei: bigint
  quantityToSell: bigint
  listingTimestamp: bigint
  isActive: boolean
}

export default function ListingCard({ 
  listing,
  onPurchase,
  loading
}: { 
  listing: Listing
  onPurchase: () => void
  loading: boolean
}) {
  const t = useTranslations()
  
  const cropTypes = [
    'maize', 'rice', 'wheat', 'cassava', 'beans', 
    'sorghum', 'millet', 'yam', 'potatoes', 'coffee', 'cotton'
  ]

  const cropImage = `/crops/${cropTypes[Number(listing.cropId)]}.png`

  return (
    <div className="card group hover:shadow-lg transition-shadow">
      <div className="p-4 flex items-start space-x-4">
        <div className="flex-shrink-0 relative">
          <Image 
            src={cropImage}
            alt={t(cropTypes[Number(listing.cropId)])}
            width={80}
            height={80}
            className="rounded-lg object-cover border border-secondary-200"
          />
          <span className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
            <span className="block w-3 h-3 rounded-full bg-green-500"></span>
          </span>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg capitalize">
            {t(cropTypes[Number(listing.cropId)])}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-secondary-500 text-sm">Quantity</p>
              <p className="font-medium">{listing.quantityToSell.toString()}</p>
            </div>
            <div>
              <p className="text-secondary-500 text-sm">Price</p>
              <p className="font-medium">
                {(Number(listing.priceInWei) / 1e18).toFixed(4)} ETH
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-secondary-100 p-4 bg-secondary-50">
        <button
          onClick={onPurchase}
          disabled={loading}
          className="btn btn-primary w-full flex items-center justify-center"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ShoppingCart className="w-4 h-4 mr-2" />
          )}
          {t('purchase')}
        </button>
      </div>
    </div>
  )
}