// components/dashboard/FarmerProfile.tsx
import { useTranslations } from 'next-intl'
import { type Farmer } from '@/types'
import { formatNumber } from '@/lib/utils'

interface FarmerProfileProps {
  farmer: Farmer
}

export const FarmerProfile: React.FC<FarmerProfileProps> = ({ farmer }) => {
  const t = useTranslations('Dashboard')
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-700">
            {t('farmerProfile')}
          </h2>
          <p className="text-secondary-500">
            {t('address')}: {farmer.walletAddress}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary-500">{t('reputation')}</p>
          <p className="text-xl font-bold text-primary-600">
            {formatNumber(farmer.reputationPoints)}
          </p>
        </div>
      </div>
    </div>
  )
}