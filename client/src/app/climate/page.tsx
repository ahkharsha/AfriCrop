'use client'

import { useAccount } from 'wagmi'
import { useAfriCropDAO } from '@/hooks/useAfriCropDAO'
import { SustainabilityChart } from '@/components/climate/SustainabilityChart'
import { CarbonCredits } from '@/components/climate/CarbonCredits'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClimatePage() {
  const { address } = useAccount()
  const { farmerData, isLoading } = useAfriCropDAO(address)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!farmerData) {
    return <div className="text-center py-12">No climate data available</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Climate Impact</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SustainabilityChart score={farmerData.sustainabilityScore} />
        </div>
        <div className="space-y-4">
          <CarbonCredits score={farmerData.sustainabilityScore} />
        </div>
      </div>
    </div>
  )
}