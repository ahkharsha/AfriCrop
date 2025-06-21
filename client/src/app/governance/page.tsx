'use client'

import { useGovernance } from '@/hooks/useGovernance'
import { ProposalCard } from '@/components/governance/ProposalCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function GovernancePage() {
  const { proposals, isLoading } = useGovernance()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">DAO Governance</h1>
        <Button asChild>
          <Link href="/governance/create">Create Proposal</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No active proposals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  )
}