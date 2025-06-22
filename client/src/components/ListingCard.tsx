// src/components/ListingCard.tsx
'use client'

import { useTranslations } from '../utils/i18n'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'

type Listing = {
  listingId: bigint
  cropId: bigint
  seller: string
  priceInWei: bigint
  quantityToSell: bigint
  listingTimestamp: bigint
  isActive: boolean
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const t = useTranslations()
  
  const cropTypes = [
    'maize', 'rice', 'wheat', 'cassava', 'beans', 
    'sorghum', 'millet', 'yam', 'potatoes', 'coffee', 'cotton'
  ]

  return (
    <div className="card group">
      <div className="p-4 flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Image 
            src={`/crops/${cropTypes[Number(listing.cropId)]}.png`}
            alt={t(cropTypes[Number(listing.cropId)])}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
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
      
      <div className="border-t border-secondary-200 p-4">
        <button className="btn btn-primary w-full group-hover:bg-primary-700 transition-colors">
          <ShoppingCart className="w-5 h-5 mr-2" />
          {t('purchase')}
        </button>
      </div>
    </div>
  )
}