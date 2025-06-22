// src/app/crops/page.tsx
'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// Define the Crop type matching your Solidity struct
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

export default function CropsPage() {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const t = useTranslations()

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
      args: [0, "farm123", 100], // Example: MAIZE, farm ID, 100 seeds
    })
  }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('myCrops')}</h1>
          <button onClick={sowCrop} className="btn btn-primary">
            {t('sowNewCrop')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmerCrops?.map((cropId: bigint) => (
            <CropCard key={cropId.toString()} cropId={Number(cropId)} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function CropCard({ cropId }: { cropId: number }) {
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

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{t('crop')} #{cropId}</h3>
      <div className="space-y-1 text-sm">
        <p className="text-secondary-600">
          <span className="font-medium">{t('type')}:</span> {t(crop[2].toString().toLowerCase())}
        </p>
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
      <button className="btn btn-outline w-full mt-4">
        {t('manageCrop')}
      </button>
    </div>
  )
}