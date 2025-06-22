import { useTranslations } from 'next-intl'
import { CropCard } from '@/components/crops/CropCard'
import { Button } from '@/components/ui/Button'
import { useCrops } from '@/hooks/useCrops'
import { useChainCheck } from '@/hooks/useChainCheck'

export default function CropsPage() {
  const t = useTranslations('Crops')
  const { isConnected, isCorrectChain } = useChainCheck()
  const { crops, isLoading, error } = useCrops()

  if (!isConnected || !isCorrectChain) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">{t('connectWallet')}</h2>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <p className="text-red-500">{t('errorLoading')}</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-700">{t('title')}</h1>
        <Button variant="accent">{t('newCrop')}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <CropCard key={crop.id} crop={crop} />
        ))}
      </div>
    </div>
  )
}