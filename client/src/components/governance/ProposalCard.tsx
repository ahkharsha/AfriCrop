import { type Proposal } from '@/types'
import { Button } from '../ui/button'
import Link from 'next/link'
import { formatEther } from 'viem'
import { cn } from '@/lib/utils'

const proposalTypeNames = [
  'Admin Change',
  'Fund Allocation',
  'Parameter Change',
  'Research Grant'
]

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const isPassing = proposal.yesVotes > proposal.noVotes
  const totalVotes = proposal.yesVotes + proposal.noVotes
  const yesPercentage = totalVotes > 0 ? (Number(proposal.yesVotes) * 100) / Number(totalVotes) : 0

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{proposal.description}</h3>
        <span className="text-sm px-2 py-1 bg-muted rounded">
          {proposalTypeNames[proposal.proposalType]}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Proposer</span>
          <span>{proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Stake</span>
          <span>{formatEther(proposal.stakeAmount)} ETH</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Yes: {proposal.yesVotes.toString()}</span>
          <span>No: {proposal.noVotes.toString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              'h-2 rounded-full',
              isPassing ? 'bg-green-500' : 'bg-red-500'
            )}
            style={{ width: `${yesPercentage}%` }}
          />
        </div>
      </div>

      <Button variant="outline" size="sm" asChild className="w-full">
        <Link href={`/governance/${proposal.id}`}>View Details</Link>
      </Button>
    </div>
  )
}