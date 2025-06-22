// src/app/farm/page.tsx
'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useState } from 'react'
import toast from 'react-hot-toast'

type Crop = [
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

export default function FarmPage() {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const t = useTranslations()
  const [selectedCropType, setSelectedCropType] = useState(0)
  const [seedsAmount, setSeedsAmount] = useState(100)

  const { data: farmerCrops } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getFarmerCrops',
    args: [address],
  }) as { data: bigint[] | undefined }

  const sowCrop = () => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'sowCrop',
      args: [selectedCropType, "farm123", seedsAmount],
    }, {
      onSuccess: () => {
        toast.success('Crop sown successfully!')
      },
      onError: (error) => {
        toast.error(`Failed to sow crop: ${error.message}`)
      }
    })
  }

  const updateCropStage = (cropId: number, newStage: number) => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'updateCropStage',
      args: [cropId, newStage],
    }, {
      onSuccess: () => {
        toast.success('Crop stage updated!')
      },
      onError: (error) => {
        toast.error(`Failed to update crop: ${error.message}`)
      }
    })
  }

  const storeCrop = (cropId: number) => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'storeCrop',
      args: [cropId],
    }, {
      onSuccess: () => {
        toast.success('Crop stored in silo!')
      },
      onError: (error) => {
        toast.error(`Failed to store crop: ${error.message}`)
      }
    })
  }

  const cropTypes = [
    { id: 0, name: 'maize', image: '/crops/maize.png' },
    { id: 1, name: 'rice', image: '/crops/rice.png' },
    { id: 2, name: 'wheat', image: '/crops/wheat.png' },
    { id: 3, name: 'cassava', image: '/crops/cassava.png' },
    { id: 4, name: 'beans', image: '/crops/beans.png' },
    { id: 5, name: 'sorghum', image: '/crops/sorghum.png' },
    { id: 6, name: 'millet', image: '/crops/millet.png' },
    { id: 7, name: 'yam', image: '/crops/yam.png' },
    { id: 8, name: 'potatoes', image: '/crops/potatoes.png' },
    { id: 9, name: 'coffee', image: '/crops/coffee.png' },
    { id: 10, name: 'cotton', image: '/crops/cotton.png' },
  ]

  return (
    <div>
      <Nav />
      <main className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Farm</h1>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedCropType}
              onChange={(e) => setSelectedCropType(Number(e.target.value))}
              className="border border-secondary-300 rounded-md px-3 py-2"
            >
              {cropTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {t(type.name)}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={seedsAmount}
              onChange={(e) => setSeedsAmount(Number(e.target.value))}
              min="1"
              className="border border-secondary-300 rounded-md px-3 py-2 w-20"
            />
            <button onClick={sowCrop} className="btn btn-primary">
              {t('sowNewCrop')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmerCrops?.map((cropId: bigint) => (
            <CropCard 
              key={cropId.toString()} 
              cropId={Number(cropId)} 
              onUpdateStage={updateCropStage}
              onStore={storeCrop}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function CropCard({ 
  cropId, 
  onUpdateStage,
  onStore
}: { 
  cropId: number
  onUpdateStage: (cropId: number, newStage: number) => void
  onStore: (cropId: number) => void
}) {
  const { data: crop } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'crops',
    args: [cropId],
  }) as { data: Crop | undefined }
  
  const t = useTranslations()
  
  if (!crop) return null

  const cropStage = (stage: bigint) => {
    switch(Number(stage)) {
      case 0: return t('sown')
      case 1: return t('growing')
      case 2: return t('harvested')
      case 3: return t('selling')
      case 4: return t('sold')
      case 5: return t('cancelled')
      default: return t('unknown')
    }
  }

  const cropTypes = [
    'maize', 'rice', 'wheat', 'cassava', 'beans', 
    'sorghum', 'millet', 'yam', 'potatoes', 'coffee', 'cotton'
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <img 
          src={`/crops/${cropTypes[Number(crop[2])]}.png`} 
          alt={t(cropTypes[Number(crop[2])])}
          className="w-16 h-16 object-cover rounded-lg mr-4"
        />
        <div>
          <h3 className="font-semibold text-lg">{t(cropTypes[Number(crop[2])])}</h3>
          <p className="text-secondary-600 text-sm">Land #{cropId}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm mb-4">
        <p className="text-secondary-600">
          <span className="font-medium">{t('stage')}:</span> {cropStage(crop[6])}
        </p>
        <p className="text-secondary-600">
          <span className="font-medium">{t('seeds')}:</span> {crop[7].toString()}
        </p>
        {Number(crop[6]) > 1 && (
          <p className="text-secondary-600">
            <span className="font-medium">{t('harvested')}:</span> {crop[8].toString()}
          </p>
        )}
      </div>

      <div className="space-y-2">
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