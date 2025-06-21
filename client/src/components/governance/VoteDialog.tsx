'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { useReadContract } from 'wagmi'

export function VoteDialog({ proposalId }: { proposalId: bigint }) {
  const [open, setOpen] = useState(false)
  const [vote, setVote] = useState<boolean | null>(null)
  const { address } = useAccount()

  const { data: votingPower } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'calculateVotingPower',
    args: [address || '0x'],
  })

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Vote submitted',
          description: 'Your vote has been recorded',
        })
        setOpen(false)
      },
      onError: (error) => {
        toast({
          title: 'Error submitting vote',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  })

  const handleVote = () => {
    if (vote === null) return
    
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'voteOnProposal',
      args: [proposalId, vote],
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Vote</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cast Your Vote</DialogTitle>
          <DialogDescription>
            Your voting power: {votingPower?.toString() || 0}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant={vote === true ? 'default' : 'outline'}
              onClick={() => setVote(true)}
              className="flex-1"
            >
              Yes
            </Button>
            <Button
              variant={vote === false ? 'default' : 'outline'}
              onClick={() => setVote(false)}
              className="flex-1"
            >
              No
            </Button>
          </div>

          <Button 
            onClick={handleVote} 
            disabled={isPending || vote === null}
            className="w-full"
          >
            {isPending ? 'Submitting...' : 'Submit Vote'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}