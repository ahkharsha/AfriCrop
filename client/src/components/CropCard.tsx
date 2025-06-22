// src/components/CropCard.tsx
'use client'

import { useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '../utils/contract'
import { useTranslations } from '../utils/i18n'
import Image from 'next/image'
import ProgressBar from './ProgressBar'

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
  onUpdateStage,
  onStore
}: { 
  cropId: number
  onUpdateStage: (cropId: number, newStage: number) => void
  onStore: (cropId: number) => void
}) {
  const t = useTranslations()
  
  const { data: crop } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'crops',
    args: [BigInt(cropId)],
  }) as { data: CropData | undefined }

  if (!crop) return null

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

  const stageInfo = cropStage(crop[6])

  return (
    <div className="card border border-secondary-200 hover:border-primary-300 transition-colors">
      <div className="p-4 flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Image 
            src={`/crops/${cropTypes[Number(crop[2])]}.png`} 
            alt={t(cropTypes[Number(crop[2])])}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg capitalize">{t(cropTypes[Number(crop[2])])}</h3>
              <p className="text-secondary-600 text-sm">Land #{cropId}</p>
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
      
      <div className="border-t border-secondary-200 p-4">
        {Number(crop[6]) === 0 && (
          <button 
            onClick={() => onUpdateStage(cropId, 1)}
            className="btn btn-outline w-full"
          >
            Mark as Growing
          </button>
        )}
        {Number(crop[6]) === 1 && (
          <button 
            onClick={() => onUpdateStage(cropId, 2)}
            className="btn btn-outline w-full"
          >
            Mark as Harvested
          </button>
        )}
        {Number(crop[6]) === 2 && (
          <button 
            onClick={() => onStore(cropId)}
            className="btn btn-primary w-full"
          >
            Store in Silo
          </button>
        )}
      </div>
    </div>
  )
}