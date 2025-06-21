'use client'

import { useParams } from 'next/navigation'
import { useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { CropStageIndicator } from '@/components/crops/CropStageIndicator'
import { CropTimeline } from '@/components/crops/CropTimeline'
import { useAccount } from 'wagmi'
import { toast } from '@/components/ui/use-toast'
import { useWriteContract } from 'wagmi'
import Link from 'next/link'
import { type Abi } from 'viem'

// Define the Crop type based on your contract
type Crop = {
  id: bigint
  farmerAddress: `0x${string}`
  cropType: number
  farmId: string
  sownTimestamp: bigint
  harvestedTimestamp: bigint
  stage: number
  initialSeeds: bigint
  harvestedOutput: bigint
}

const cropTypeNames = [
  'Maize', 'Rice', 'Wheat', 'Cassava', 'Beans', 
  'Sorghum', 'Millet', 'Yam', 'Potatoes', 'Coffee', 'Cotton'
]

export default function CropDetailPage() {
  const { id } = useParams()
  const { address } = useAccount()
  
  const { data: crop, isLoading } = useReadContract({
    abi: AfriCropDAOABI as Abi,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'crops',
    args: [BigInt(id as string)],
    query: {
      select: (data: any): Crop => ({
        id: data[0] as bigint,
        farmerAddress: data[1] as `0x${string}`,
        cropType: Number(data[2]),
        farmId: data[3] as string,
        sownTimestamp: data[4] as bigint,
        harvestedTimestamp: data[5] as bigint,
        stage: Number(data[6]),
        initialSeeds: data[7] as bigint,
        harvestedOutput: data[8] as bigint,
      })
    }
  })

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Crop updated',
          description: 'Crop stage has been advanced',
        })
      },
      onError: (error) => {
        toast({
          title: 'Error updating crop',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  })

  const advanceStage = () => {
    if (!crop) return
    
    let newStage
    if (crop.stage === 0) newStage = 1 // SOWN → GROWING
    else if (crop.stage === 1) newStage = 2 // GROWING → HARVESTED
    
    writeContract({
      abi: AfriCropDAOABI as Abi,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'updateCropStage',
      args: [BigInt(id as string), newStage],
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-green"></div>
      </div>
    )
  }

  if (!crop) {
    return <div className="text-center py-12">Crop not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {cropTypeNames[crop.cropType] || 'Unknown Crop'}
        </h1>
        <CropStageIndicator stage={crop.stage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <CropTimeline 
            stage={crop.stage} 
            sownDate={new Date(Number(crop.sownTimestamp) * 1000)}
            harvestedDate={crop.harvestedTimestamp ? new Date(Number(crop.harvestedTimestamp) * 1000) : null}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Initial Seeds</h3>
              <p className="text-xl font-semibold">{crop.initialSeeds.toString()}</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Harvested Output</h3>
              <p className="text-xl font-semibold">
                {crop.harvestedOutput?.toString() || 'Not harvested'}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Farm ID</h3>
            <p className="font-mono">{crop.farmId}</p>
          </div>
        </div>

        <div className="space-y-4">
          {address === crop.farmerAddress && (
            <>
              {crop.stage < 2 && (
                <Button 
                  onClick={advanceStage} 
                  disabled={isPending}
                  className="w-full"
                >
                  {crop.stage === 0 ? 'Mark as Growing' : 'Harvest Crop'}
                </Button>
              )}

              {crop.stage === 2 && (
                <Button asChild className="w-full">
                  <Link href={`/marketplace/list?cropId=${id}`}>
                    List on Marketplace
                  </Link>
                </Button>
              )}
            </>
          )}

          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Farmer</h3>
            <p className="font-mono">{crop.farmerAddress}</p>
          </div>
        </div>
      </div>
    </div>
  )
}