'use client'

import { useAccount } from 'wagmi'
import { useCrops } from '@/hooks/useCrops'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CropCard } from '@/components/crops/CropCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function CropsPage() {
  const { address } = useAccount()
  const { crops, isLoading } = useCrops(address)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Crops</h1>
        <Button asChild>
          <Link href="/crops/sow">Sow New Crop</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : crops.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">You haven't sown any crops yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      )}
    </div>
  )
}