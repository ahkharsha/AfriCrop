// src/app/page.tsx (1)
'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useTranslations } from '../utils/i18n'
import { contractAddress, contractABI } from '@/utils/contract'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import StatsCard from '@/components/StatsCard'
import FarmerQRCode from '@/components/FarmerQRCode'
import { Crop, ShoppingBag, BookOpen, Users, Leaf } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { isConnected, address } = useAccount()
  const { writeContract } = useWriteContract()
  const { push } = useRouter()
  const t = useTranslations()
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [farmerStats, setFarmerStats] = useState({
    reputation: 0,
    sustainability: 0,
    knowledge: 0,
    harvest: 0,
    activeCrops: 0,
    storedCrops: 0,
    marketCrops: 0,
    lastActivity: 0
  })

  const { data: farmer, refetch: refetchFarmer } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'farmers',
    args: [address!],
  }) as { data: any, refetch: () => void }

  const { data: farmCrops, refetch: refetchFarmCrops } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getFarmerCrops',
    args: [address],
  }) as { data: bigint[] | undefined, refetch: () => void }

  const { data: siloCrops, refetch: refetchSiloCrops } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getFarmerStoredCrops',
    args: [address],
  }) as { data: bigint[] | undefined, refetch: () => void }

  const { data: marketListings } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getActiveMarketListings',
  }) as { data: any[] | undefined }

  useEffect(() => {
    if (farmer && farmer[6]) { // isRegistered field
      setIsRegistered(true)
      setFarmerStats(prev => ({
        ...prev,
        reputation: Number(farmer[1]),
        sustainability: Number(farmer[2]),
        knowledge: Number(farmer[3]),
        harvest: Number(farmer[4]),
        lastActivity: Number(farmer[5]),
        activeCrops: farmCrops?.length || 0,
        storedCrops: siloCrops?.length || 0,
        marketCrops: marketListings?.filter(l => l.seller === address)?.length || 0
      }))
    }
  }, [farmer, farmCrops, siloCrops, marketListings, address])

  const registerFarmer = () => {
    setLoading(true)
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'registerFarmer',
    }, {
      onSuccess: () => {
        toast.success(t('registrationSuccess'))
        setIsRegistered(true)
        refetchFarmer()
      },
      onError: (error) => {
        toast.error(t('registrationError'))
      },
      onSettled: () => {
        setLoading(false)
      }
    })
  }

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Never'
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  return (
    <>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">{t('welcome')}</h1>

          {isConnected ? (
            <>
              {!isRegistered ? (
                <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto text-center">
                  <h2 className="text-xl font-semibold mb-4">{t('registerAsFarmer')}</h2>
                  <p className="mb-4 text-secondary-600">{t('registerPrompt')}</p>
                  <button 
                    onClick={registerFarmer}
                    disabled={loading}
                    className="btn btn-primary w-full"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">🌀</span>
                        {t('registering')}
                      </span>
                    ) : t('registerNow')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title={t('reputationPoints')}
                    value={farmerStats.reputation}
                    icon={<Users className="w-5 h-5" />}
                  />
                  <StatsCard
                    title={t('sustainabilityScore')}
                    value={farmerStats.sustainability}
                    icon={<Leaf className="w-5 h-5" />}
                  />
                  <StatsCard
                    title={t('knowledgePoints')}
                    value={farmerStats.knowledge}
                    icon={<BookOpen className="w-5 h-5" />}
                  />
                  <StatsCard
                    title={t('harvestPoints')}
                    value={farmerStats.harvest}
                    icon={<Crop className="w-5 h-5" />}
                  />
                  <StatsCard
                    title={t('activeLands')}
                    value={farmerStats.activeCrops}
                    icon={<Leaf className="w-5 h-5" />}
                    link="/farm"
                  />
                  <StatsCard
                    title={t('storedCrops')}
                    value={farmerStats.storedCrops}
                    icon={<ShoppingBag className="w-5 h-5" />}
                    link="/silo"
                  />
                  <StatsCard
                    title={t('marketListings')}
                    value={farmerStats.marketCrops}
                    icon={<ShoppingBag className="w-5 h-5" />}
                    link="/market"
                  />
                  <StatsCard
                    title={t('lastActivity')}
                    value={formatDate(farmerStats.lastActivity)}
                    icon={<Users className="w-5 h-5" />}
                  />
                  <FarmerQRCode />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <p className="text-lg mb-4">{t('connectWallet')}</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}