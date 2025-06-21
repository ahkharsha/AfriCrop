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
import { VoteDialog } from '@/components/governance/VoteDialog'
import { cn } from '@/lib/utils'

interface Proposal {
  id: bigint
  proposer: string
  proposalType: number
  description: string
  stakeAmount: bigint
  startBlock: bigint
  endBlock: bigint
  yesVotes: bigint
  noVotes: bigint
  executed: boolean
  status: number
  targetAddress: string
  amount: bigint
  paramKey: bigint
  paramValue: bigint
  researchGrantDetailsIPFSHash: string
}

const proposalTypeNames = [
  'Admin Change',
  'Fund Allocation',
  'Parameter Change',
  'Research Grant'
]

export default function ProposalDetailPage() {
  const { id } = useParams()
  const { address } = useAccount()
  
  const { data: proposal, isLoading } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'proposals',
    args: [BigInt(id as string)],
  }) as { data: Proposal | null, isLoading: boolean }

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Proposal executed',
          description: 'The proposal has been processed',
        })
      },
      onError: (error) => {
        toast({
          title: 'Error executing proposal',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  })

  const executeProposal = () => {
    if (!proposal) return
    
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'executeProposal',
      args: [BigInt(id as string)],
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
      </div>
    )
  }

  if (!proposal) {
    return <div className="text-center py-12">Proposal not found</div>
  }

  const totalVotes = Number(proposal.yesVotes) + Number(proposal.noVotes)
  const yesPercentage = totalVotes > 0 ? (Number(proposal.yesVotes) * 100 ) / totalVotes : 0
  const isPassing = proposal.yesVotes > proposal.noVotes

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{proposal.description}</h1>
        <span className="text-sm px-2 py-1 bg-muted rounded">
          {proposalTypeNames[proposal.proposalType]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Details</h2>
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Proposer:</span> {proposal.proposer}
              </p>
              <p className="text-sm">
                <span className="font-medium">Stake:</span> {formatEther(proposal.stakeAmount)} ETH
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> {proposal.executed ? 'Executed' : isPassing ? 'Passing' : 'Failing'}
              </p>
            </div>
          </div>

          {proposal.proposalType === 1 && (
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Fund Allocation</h3>
              <p className="text-sm">
                <span className="font-medium">Recipient:</span> {proposal.targetAddress}
              </p>
              <p className="text-sm">
                <span className="font-medium">Amount:</span> {formatEther(proposal.amount)} ETH
              </p>
            </div>
          )}

          {proposal.proposalType === 2 && (
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Parameter Change</h3>
              <p className="text-sm">
                <span className="font-medium">Parameter Key:</span> {proposal.paramKey.toString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">New Value:</span> {proposal.paramValue.toString()}
              </p>
            </div>
          )}

          {proposal.proposalType === 3 && (
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Research Grant</h3>
              <p className="text-sm">
                <span className="font-medium">IPFS Hash:</span> {proposal.researchGrantDetailsIPFSHash}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Voting Results</h3>
            <div className="mt-2 space-y-2">
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
              <p className="text-xs text-muted-foreground text-center">
                {yesPercentage.toFixed(1)}% in favor
              </p>
            </div>
          </div>

          {!proposal.executed && (
            <>
              <VoteDialog proposalId={BigInt(id as string)} />

              {address === proposal.proposer && (
                <Button 
                  onClick={executeProposal} 
                  disabled={isPending}
                  className="w-full"
                >
                  Execute Proposal
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}