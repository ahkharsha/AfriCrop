'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem 
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

export default function SowCropPage() {
  const [cropType, setCropType] = useState('')
  const [farmId, setFarmId] = useState('')
  const [initialSeeds, setInitialSeeds] = useState('')
  const { address } = useAccount()
  const router = useRouter()

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Crop sown successfully',
          description: 'Your new crop has been registered',
        })
        router.push('/crops')
      },
      onError: (error) => {
        toast({
          title: 'Error sowing crop',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cropType || !farmId || !initialSeeds) return

    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'sowCrop',
      args: [parseInt(cropType), farmId, BigInt(initialSeeds)],
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sow New Crop</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cropType">Crop Type</Label>
          <Select value={cropType} onValueChange={setCropType}>
            <SelectTrigger>
              <SelectValue placeholder="Select crop type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Maize</SelectItem>
              <SelectItem value="1">Rice</SelectItem>
              <SelectItem value="2">Wheat</SelectItem>
              <SelectItem value="3">Cassava</SelectItem>
              <SelectItem value="4">Beans</SelectItem>
              <SelectItem value="5">Sorghum</SelectItem>
              <SelectItem value="6">Millet</SelectItem>
              <SelectItem value="7">Yam</SelectItem>
              <SelectItem value="8">Potatoes</SelectItem>
              <SelectItem value="9">Coffee</SelectItem>
              <SelectItem value="10">Cotton</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="farmId">Farm ID</Label>
          <Input
            id="farmId"
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
            placeholder="Enter your farm ID"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="initialSeeds">Initial Seeds</Label>
          <Input
            id="initialSeeds"
            type="number"
            value={initialSeeds}
            onChange={(e) => setInitialSeeds(e.target.value)}
            placeholder="Number of seeds planted"
            required
            min="1"
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Sowing...' : 'Sow Crop'}
        </Button>
      </form>
    </div>
  )
}