'use client'

import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { formatEther } from 'viem'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { toast } from '../ui/use-toast'
import { type MarketListing } from '@/types' // Add this import

export function PurchaseModal({
  listing,
  children,
}: {
  listing: MarketListing
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Purchase successful',
          description: 'The crop has been transferred to your ownership',
        })
        setOpen(false)
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
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'purchaseCrop',
      args: [listing.listingId],
      value: listing.priceInWei,
    })
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              You are about to purchase {listing.quantityToSell.toString()} units for {formatEther(listing.priceInWei)} ETH
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Seller</p>
              <p className="text-sm text-muted-foreground">
                {listing.seller}
              </p>
            </div>

            <Button 
              onClick={handlePurchase} 
              disabled={isPending || !address}
              className="w-full"
            >
              {isPending ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}