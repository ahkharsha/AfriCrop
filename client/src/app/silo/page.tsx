'use client'

import { useAccount, useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CropCard from '@/components/CropCard'
import ListingCard from '@/components/ListintCard'

type FarmerCropResponse = bigint[]
type MarketListing = {
  listingId: bigint
  cropId: bigint
  seller: string
  priceInWei: bigint
  quantityToSell: bigint
  listingTimestamp: bigint
  isActive: boolean
}

export default function SiloPage() {
  const { address } = useAccount()
  const t = useTranslations()
  
  const { data: farmerCrops } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getFarmerCrops',
    args: [address],
  }) as { data: FarmerCropResponse | undefined }

  const { data: listings } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getActiveMarketListings',
  }) as { data: MarketListing[] | undefined }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <h1 className="text-2xl font-bold mb-6">{t('mySilo')}</h1>
        
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">{t('allCrops')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmerCrops?.map((cropId) => (
              <CropCard key={cropId.toString()} cropId={Number(cropId)} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('marketListings')}</h2>
          {listings?.filter(l => l.seller === address).map((listing) => (
            <ListingCard key={listing.listingId.toString()} listing={listing} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}