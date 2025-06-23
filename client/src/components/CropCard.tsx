// src/components/CropCard.tsx (1)
'use client'

import { useReadContract, useWriteContract } from 'wagmi'
import { contractAddress, contractABI } from '../utils/contract'
import { useTranslations } from '../utils/i18n'
import Image from 'next/image'
import ProgressBar from './ProgressBar'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

type CropData = [
  id: bigint,
  farmerAddress: string,
  cropType: bigint,
  farmId: string,
  sownTimestamp: bigint,
  harvestedTimestamp: bigint,
  stage: bigint,
  initialSeeds: bigint,
  harvestedOutput: bigint
]

export default function CropCard({ 
  cropId,
  onUpdate,
}: { 
  cropId: number
  onUpdate: () => void
}) {
  const t = useTranslations()
  const { writeContract } = useWriteContract()
  const [loading, setLoading] = useState(false)
  const [showHarvestModal, setShowHarvestModal] = useState(false)
  const [lossPercentage, setLossPercentage] = useState('10')
  
  const { data: crop } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'crops',
    args: [BigInt(cropId)],
  }) as { data: CropData | undefined }

  const cropTypes = [
    'maize', 'rice', 'wheat', 'cassava', 'beans', 
    'sorghum', 'millet', 'yam', 'potatoes', 'coffee', 'cotton'
  ]

  const cropStage = (stage: bigint) => {
    switch(Number(stage)) {
      case 0: return { text: t('sown'), color: 'bg-blue-500', progress: 30 }
      case 1: return { text: t('growing'), color: 'bg-green-500', progress: 60 }
      case 2: return { text: t('harvested'), color: 'bg-yellow-500', progress: 100 }
      default: return { text: t('unknown'), color: 'bg-gray-500', progress: 0 }
    }
  }

  const handleUpdateStage = async (newStage: number) => {
    if (newStage === 2) {
      setShowHarvestModal(true)
      return
    }

    setLoading(true)
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'updateCropStage',
      args: [BigInt(cropId), BigInt(newStage), BigInt(0)],
    }, {
      onSuccess: () => {
        toast.success(`Crop updated to ${cropStage(BigInt(newStage)).text}!`)
        onUpdate()
      },
      onError: (error) => {
        toast.error(`Failed to update crop: ${error.message}`)
      },
      onSettled: () => {
        setLoading(false)
      }
    })
  }

  const handleHarvest = async () => {
    setLoading(true)
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'updateCropStage',
      args: [BigInt(cropId), BigInt(2), BigInt(lossPercentage)],
    }, {
      onSuccess: () => {
        toast.success(`Crop harvested with ${lossPercentage}% loss!`)
        onUpdate()
        setShowHarvestModal(false)
      },
      onError: (error) => {
        toast.error(`Failed to harvest crop: ${error.message}`)
      },
      onSettled: () => {
        setLoading(false)
      }
    })
  }

  const handleStoreCrop = async () => {
    setLoading(true)
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'storeCrop',
      args: [BigInt(cropId)],
    }, {
      onSuccess: () => {
        toast.success('Crop stored in silo successfully!')
        onUpdate()
      },
      onError: (error) => {
        toast.error(`Failed to store crop: ${error.message}`)
      },
      onSettled: () => {
        setLoading(false)
      }
    })
  }

  if (!crop) return null

  const stageInfo = cropStage(crop[6])

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-secondary-100 hover:shadow-lg transition-shadow">
      <div className="p-4 flex items-start space-x-4">
        <div className="flex-shrink-0 relative">
          <Image 
            src={`/crops/${cropTypes[Number(crop[2])]}.png`} 
            alt={t(cropTypes[Number(crop[2])])}
            width={80}
            height={80}
            className="rounded-lg object-cover border border-secondary-200"
          />
          <span className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
            <span className={`block w-3 h-3 rounded-full ${stageInfo.color}`}></span>
          </span>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg capitalize">{t(cropTypes[Number(crop[2])])}</h3>
              <p className="text-secondary-600 text-sm">ID: {cropId}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color} text-white`}>
              {stageInfo.text}
            </span>
          </div>
          
          <ProgressBar progress={stageInfo.progress} className="my-3" />
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-secondary-500">Seeds Planted</p>
              <p className="font-medium">{crop[7].toString()}</p>
            </div>
            {Number(crop[6]) >= 2 && (
              <div>
                <p className="text-secondary-500">Harvested</p>
                <p className="font-medium">{crop[8].toString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-secondary-100 p-4 bg-secondary-50">
        {Number(crop[6]) === 0 && (
          <button 
            onClick={() => handleUpdateStage(1)}
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Mark as Growing
          </button>
        )}
        {Number(crop[6]) === 1 && (
          <button 
            onClick={() => handleUpdateStage(2)}
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Mark as Harvested
          </button>
        )}
        {Number(crop[6]) === 2 && (
          <button 
            onClick={handleStoreCrop}
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Store in Silo
          </button>
        )}
      </div>

      {/* Harvest Modal */}
      {showHarvestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Harvest Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Estimated Loss Percentage (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={lossPercentage}
                onChange={(e) => setLossPercentage(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowHarvestModal(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleHarvest}
                disabled={loading}
                className="btn btn-primary flex-1 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Confirm Harvest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}