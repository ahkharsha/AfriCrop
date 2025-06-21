import { useTranslations } from 'next-intl'
import { CarbonCard } from '@/components/climate/CarbonCard'
import { Leaderboard } from '@/components/climate/Leaderboard'
import { ImpactChart } from '@/components/climate/ImpactChart'
import { useClimate } from '@/hooks/useClimate'
import { useChainCheck } from '@/hooks/useChainCheck'

export default function ClimatePage() {
  const t = useTranslations('Climate')
  const { isConnected, isCorrectChain } = useChainCheck()
  const { carbonData, leaderboard, isLoading } = useClimate()

  if (!isConnected || !isCorrectChain) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">{t('connectWallet')}</h2>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary-700">{t('title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CarbonCard data={carbonData} />
          <ImpactChart data={carbonData} />
        </div>
        <div>
          <Leaderboard data={leaderboard} />
        </div>
      </div>
    </div>
  )
}