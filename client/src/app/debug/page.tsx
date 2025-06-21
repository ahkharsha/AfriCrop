'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { AfriCropDAOABI } from '../../lib/contracts'
import { AFRICROP_DAO_ADDRESS } from '../../lib/constants'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { toast } from '../../components/ui/use-toast'
import { useReadContract } from 'wagmi'

export default function DebugPage() {
  const [cropId, setCropId] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [reputationPoints, setReputationPoints] = useState('')
  const { address } = useAccount()

  const { data: debugMode } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'debugMode',
  })

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Debug action executed',
        })
      },
      onError: (error) => {
        toast({
          title: 'Error executing debug action',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  })

  const forceHarvest = () => {
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'debug_ForceHarvest',
      args: [BigInt(cropId)],
    })
  }

  const completeLesson = () => {
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'debug_CompleteLesson',
      args: [address || '0x', BigInt(lessonId)],
    })
  }

  const addReputation = () => {
    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'debug_AddReputation',
      args: [address || '0x', BigInt(reputationPoints)],
    })
  }

  if (!debugMode) {
    return (
      <div className="text-center py-12">
        <p>Debug mode is not enabled</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Developer Tools</h1>
      <p className="text-muted-foreground">
        Warning: These functions are for development purposes only
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold">Force Harvest</h2>
          <div className="space-y-2">
            <Label htmlFor="cropId">Crop ID</Label>
            <Input
              id="cropId"
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              placeholder="Enter crop ID"
            />
          </div>
          <Button 
            onClick={forceHarvest} 
            disabled={isPending || !cropId}
            className="w-full"
          >
            Force Harvest
          </Button>
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold">Complete Lesson</h2>
          <div className="space-y-2">
            <Label htmlFor="lessonId">Lesson ID</Label>
            <Input
              id="lessonId"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              placeholder="Enter lesson ID"
            />
          </div>
          <Button 
            onClick={completeLesson} 
            disabled={isPending || !lessonId}
            className="w-full"
          >
            Complete Lesson
          </Button>
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold">Add Reputation</h2>
          <div className="space-y-2">
            <Label htmlFor="reputation">Points</Label>
            <Input
              id="reputation"
              type="number"
              value={reputationPoints}
              onChange={(e) => setReputationPoints(e.target.value)}
              placeholder="Enter points"
            />
          </div>
          <Button 
            onClick={addReputation} 
            disabled={isPending || !reputationPoints}
            className="w-full"
          >
            Add Reputation
          </Button>
        </div>
      </div>
    </div>
  )
}