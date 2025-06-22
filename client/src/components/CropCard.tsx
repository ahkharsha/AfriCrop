'use client'

import { useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '../utils/contract'
import { useTranslations } from '../utils/i18n'

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

export default function CropCard({ cropId }: { cropId: number }) {
  const t = useTranslations()
  
  const { data: crop } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'crops',
    args: [BigInt(cropId)],
  }) as { data: CropData | undefined }

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
          <span className="font-medium">{t('type')}:</span> {t(crop[2].toString())}
        </p>
        <p className="text-secondary-600">
          <span className="font-medium">{t('stage')}:</span> {cropStage(crop[6])}
        </p>
        <p className="text-secondary-600">
          <span className="font-medium">{t('seeds')}:</span> {crop[7].toString()}
        </p>
        {crop[6] > BigInt(1) && (
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