import { type MarketListing } from '@/types'
import { Button } from '../ui/button'
import { formatEther } from 'viem'
import { PurchaseModal } from './PurchaseModal'

const cropTypeNames = [
  'Maize', 'Rice', 'Wheat', 'Cassava', 'Beans', 
  'Sorghum', 'Millet', 'Yam', 'Potatoes', 'Coffee', 'Cotton'
]

export function ListingCard({ listing }: { listing: MarketListing }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">
            {cropTypeNames[listing.cropId] || 'Unknown Crop'}
          </h3>
          <span className="text-sm text-muted-foreground">
            #{listing.listingId.toString()}
          </span>
        </div>

        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">
            Seller: <span className="font-medium">{listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</span>
          </p>
          <p className="text-muted-foreground">
            Price: <span className="font-medium">{formatEther(listing.priceInWei)} ETH</span>
          </p>
          <p className="text-muted-foreground">
            Quantity: <span className="font-medium">{listing.quantityToSell.toString()}</span>
          </p>
        </div>

        <PurchaseModal listing={listing}>
          <Button className="w-full">Purchase</Button>
        </PurchaseModal>
      </div>
    </div>
  )
}