'use client'

import { useAccount } from 'wagmi'
import { redirect } from 'next/navigation'
import { useAfriCropDAO } from '@/hooks/useAfriCropDAO'
import { StatsCards } from './components/StatsCards'
import { LeagueBadge } from './components/LeagueBadge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { farmerData, isLoading } = useAfriCropDAO(address)

  if (!isConnected) {
    redirect('/')
  }

  if (isLoading || !farmerData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome Back, Farmer</h1>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/crops/sow">Sow New Crop</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/education">Learn</Link>
          </Button>
        </div>
      </div>

      <LeagueBadge 
        reputation={farmerData.reputationPoints} 
        className="mx-auto"
      />

      <StatsCards 
        reputation={farmerData.reputationPoints}
        sustainability={farmerData.sustainabilityScore}
        knowledge={farmerData.knowledgePoints}
        harvest={farmerData.harvestPoints}
      />

      {/* Recent activity and other dashboard components would go here */}
    </div>
  )
}