'use client'

import { useTranslations } from '../utils/i18n'

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
  
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{t('listing')} #{listing.listingId.toString()}</h3>
      <div className="space-y-1 text-sm">
        <p className="text-secondary-600">
          <span className="font-medium">{t('price')}:</span> {listing.priceInWei.toString()} wei
        </p>
        <p className="text-secondary-600">
          <span className="font-medium">{t('quantity')}:</span> {listing.quantityToSell.toString()}
        </p>
      </div>
      <button className="btn btn-primary w-full mt-4">
        {t('purchase')}
      </button>
    </div>
  )
}