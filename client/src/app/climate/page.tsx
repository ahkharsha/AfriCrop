// src/app/climate/page.tsx
'use client'

import { useAccount, useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Card from '@/components/Card'
import StatsCard from '@/components/StatsCard'
import { Leaf, Award, Droplet, Cloud } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ClimatePage() {
  const { address, isConnected } = useAccount()
  const t = useTranslations()
  const router = useRouter()
  
  const { data: farmer } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'farmers',
    args: [address!],
  }) as { data: any }

  const { data: topFarmers } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getTopFarmersBySustainability',
    args: [20],
  }) as { data: [string[], bigint[]] | undefined }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-lg mb-4">{t('connectWallet')}</p>
      </div>
    )
  }

  if (!farmer?.[6]) { // isRegistered field
    return (
      <div className="text-center py-12">
        <p className="text-lg mb-4">{t('registerFarmerFirst')}</p>
      </div>
    )
  }

  return (
    <main className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{t('sustainabilityDashboard')}</h1>
        <p className="text-secondary-600 mb-8">
          {t('trackEnvironmentalImpact')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title={t('yourSustainabilityScore')}
            value={farmer ? farmer[2].toString() : '0'}
            icon={<Leaf className="w-5 h-5 text-green-500" />}
            trend="up"
          />
          <StatsCard
            title={t('knowledgePoints')}
            value={farmer ? farmer[3].toString() : '0'}
            icon={<Award className="w-5 h-5 text-blue-500" />}
            trend="neutral"
          />
          <StatsCard
            title={t('waterConservation')}
            value="85%"
            icon={<Droplet className="w-5 h-5 text-blue-400" />}
            trend="up"
          />
          <StatsCard
            title={t('carbonFootprint')}
            value={t('low')}
            icon={<Cloud className="w-5 h-5 text-gray-500" />}
            trend="down"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card title={t('sustainabilityLeaderboard')}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-3 px-4">{t('rank')}</th>
                      <th className="text-left py-3 px-4">{t('farmer')}</th>
                      <th className="text-right py-3 px-4">{t('score')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topFarmers?.[0]?.map((farmerAddress, index) => (
                      <tr 
                        key={farmerAddress} 
                        className={`border-b border-secondary-100 ${
                          farmerAddress === address ? 'bg-primary-50' : ''
                        }`}
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          {farmerAddress === address ? t('you') : `${farmerAddress.substring(0, 6)}...${farmerAddress.substring(38)}`}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {topFarmers[1][index].toString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div>
            <Card title={t('improvementTips')}>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('cropRotation')}</h4>
                  <p className="text-sm text-secondary-600">
                    {t('cropRotationTip')}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('waterConservation')}</h4>
                  <p className="text-sm text-secondary-600">
                    {t('waterConservationTip')}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{t('organicFertilizers')}</h4>
                  <p className="text-sm text-secondary-600">
                    {t('organicFertilizersTip')}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}