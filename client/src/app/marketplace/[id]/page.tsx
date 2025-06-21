'use client'

import { useParams } from 'next/navigation'
import { useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { type MarketListing, type Crop } from '@/types'

const cropTypeNames = [
  'Maize', 'Rice', 'Wheat', 'Cassava', 'Beans', 
  'Sorghum', 'Millet', 'Yam', 'Potatoes', 'Coffee', 'Cotton'
]

export default function ListingDetailPage() {
  const { id } = useParams()
  const { address } = useAccount()
  
  const { data: listing, isLoading: isLoadingListing } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'marketListings',
    args: [BigInt(id as string)],
  }) as { data: MarketListing | undefined, isLoading: boolean }

  const { data: crop, isLoading: isLoadingCrop } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'crops',
    args: [listing?.cropId || BigInt(0)],
    query: {
      enabled: !!listing,
    },
  }) as { data: Crop | undefined, isLoading: boolean }

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Purchase successful',
          description: 'The crop has been transferred to your ownership',
        })
      },
      onError: (error) => {
        toast({
          title: 'Purchase failed',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  })

  const handlePurchase = () => {
    if (!listing) return
    
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'purchaseCrop',
      args: [BigInt(id as string)],
      value: listing.priceInWei,
    })
  }

  if (isLoadingListing || isLoadingCrop) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
      </div>
    )
  }

  if (!listing || !crop) {
    return <div className="text-center py-12">Listing not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {cropTypeNames[Number(crop.cropType)] || 'Unknown Crop'}
        </h1>
        <span className="text-sm px-2 py-1 bg-muted rounded">
          #{id}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
              <p className="text-xl font-semibold">
                {formatEther(listing.priceInWei)} ETH
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
              <p className="text-xl font-semibold">
                {listing.quantityToSell.toString()}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Farm ID</h3>
            <p className="font-mono">{crop.farmId}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Harvest Details</h3>
            <p className="mt-1">
              <span className="font-medium">Initial Seeds:</span> {crop.initialSeeds.toString()}
            </p>
            <p>
              <span className="font-medium">Harvested Output:</span> {crop.harvestedOutput.toString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {address !== listing.seller && (
            <Button 
              onClick={handlePurchase} 
              disabled={isPending}
              className="w-full"
            >
              Purchase Now
            </Button>
          )}

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Seller</h3>
            <p className="font-mono">{listing.seller}</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Listed On</h3>
            <p className="font-mono">
              {new Date(Number(listing.listingTimestamp) * 1000).toLocaleDateString()}
            </p>
          </div>

          {address === listing.seller && (
            <Button variant="destructive" className="w-full">
              Cancel Listing
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}