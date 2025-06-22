// src/app/market.tsx
'use client'

import { useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// Define the MarketListing type matching your Solidity struct
type MarketListing = {
  listingId: bigint;
  cropId: bigint;
  seller: string;
  priceInWei: bigint;
  quantityToSell: bigint;
  listingTimestamp: bigint;
  isActive: boolean;
};

export default function MarketPage() {
  const t = useTranslations()
  
  const { data: listings } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getActiveMarketListings',
  }) as { data: MarketListing[] | undefined }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <h1 className="text-2xl font-bold mb-6">{t('marketplace')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings?.map((listing) => (
            <ListingCard key={listing.listingId.toString()} listing={listing} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ListingCard({ listing }: { listing: MarketListing }) {
  const t = useTranslations()
  
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{t('listing')} #{listing.listingId.toString()}</h3>
      <p className="text-secondary-600 mb-1">{t('crop')}: {t(listing.cropId.toString().toLowerCase())}</p>
      <p className="text-secondary-600 mb-1">{t('price')}: {listing.priceInWei.toString()} wei</p>
      <p className="text-secondary-600 mb-1">{t('quantity')}: {listing.quantityToSell.toString()}</p>
      <button className="btn btn-primary w-full mt-4">
        {t('purchase')}
      </button>
    </div>
  )
}