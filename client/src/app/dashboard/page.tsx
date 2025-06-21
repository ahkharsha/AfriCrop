import { useTranslations } from 'next-intl'
import { FarmerProfile } from '@/components/dashboard/FarmerProfile'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { useChainCheck } from '@/hooks/useChainCheck'
import { useFarmerProfile } from '@/hooks/useFarmerProfile'

export default function DashboardPage() {
  const t = useTranslations('Dashboard')
  const { isConnected, isCorrectChain } = useChainCheck()
  const { farmer, isLoading } = useFarmerProfile()

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

  if (!farmer?.isRegistered) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">{t('registerPrompt')}</h2>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <FarmerProfile farmer={farmer} />
      <StatsGrid farmer={farmer} />
      <RecentActivity />
    </div>
  )
}