// app/climate/page.tsx
import { useTranslations } from 'next-intl'
import { SustainabilityCard } from '@/components/climate/SustainabilityCard'
import { Leaderboard } from '@/components/climate/Leaderboard'
import { useFarmerProfile } from '@/hooks/useFarmerProfile'
import { useChainCheck } from '@/hooks/useChainCheck'
import { useClimate } from '@/hooks/useClimate'

export default function ClimatePage() {
  const t = useTranslations('Climate')
  const { isConnected, isCorrectChain } = useChainCheck()
  {/* Fixed by copilot */}
  type Farmer = { sustainabilityScore?: bigint } // Add other fields as needed
  const { farmer } = useFarmerProfile() as { farmer: Farmer }
  const { leaderboard } = useClimate()

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
          <SustainabilityCard 
            sustainabilityScore={farmer.sustainabilityScore ? Number(farmer.sustainabilityScore) : 0} 
          />
    
        </div>
        <div>
          {/* Fixed by copilot */}
          <Leaderboard data={Array.isArray(leaderboard) ? leaderboard : []} /> 
        </div>
      </div>
  )
}