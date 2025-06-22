// src/app/climate.tsx
'use client'

import { useAccount, useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '../utils/contract'
import { useTranslations } from '../utils/i18n'
import Nav from '../components/Nav'
import Footer from '@/components/Footer'

// Define the exact return type from the farmers mapping
type FarmerData = [
  walletAddress: string,
  reputationPoints: bigint,
  sustainabilityScore: bigint,
  knowledgePoints: bigint,
  harvestPoints: bigint,
  lastProposalStakeTime: bigint,
  isRegistered: boolean
]

export default function ClimatePage() {
  const { address } = useAccount()
  const t = useTranslations()
  
  const { data: farmer } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'farmers',
    args: [address!],
  }) as { data: FarmerData | undefined }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <h1 className="text-2xl font-bold mb-6">{t('sustainability')}</h1>
        
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('yourScore')}</h2>
          <div className="text-5xl font-bold text-primary-600 mb-2">
            {farmer ? farmer[2].toString() : '0'}
          </div>
          <p className="text-secondary-600">{t('scoreDescription')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ClimateTip 
            title={t('waterConservation')}
            description={t('waterTip')}
          />
          <ClimateTip
            title={t('soilHealth')}
            description={t('soilTip')}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ClimateTip({ title, description }: { title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  )
}