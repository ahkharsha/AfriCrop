// src/app/page.tsx (1)
'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useTranslations } from '../utils/i18n'
import Nav from '../components/Nav'
import Footer from '@/components/Footer'
import { contractAddress, contractABI } from '@/utils/contract'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import StatsCard from '@/components/StatsCard'
import { Crop, Globe, TreePine, Package, Scale, ShoppingBag, Users, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ConnectKitButton } from 'connectkit'

export default function Home() {
  const { isConnected, address } = useAccount()
  const { writeContract } = useWriteContract()
  const router = useRouter()
  const t = useTranslations()
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: farmer } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'farmers',
    args: [address!],
  }) as { data: any }

  const { data: farmCrops } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getFarmerCrops',
    args: [address],
  }) as { data: bigint[] | undefined }

  const { data: siloCrops } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getFarmerStoredCrops',
    args: [address],
  }) as { data: bigint[] | undefined }

  const { data: activeListings } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getActiveMarketListings',
  }) as { data: any[] | undefined }

  const { data: daoMembers } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getRegisteredFarmers',
  }) as { data: string[] | undefined }

  useEffect(() => {
    if (farmer && farmer[6]) { // isRegistered field
      setIsRegistered(true)
    }
  }, [farmer])

  const registerFarmer = () => {
    setLoading(true)
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'registerFarmer',
    }, {
      onSuccess: () => {
        toast.success('Successfully registered as farmer!')
        setIsRegistered(true)
      },
      onError: (error) => {
        toast.error(`Registration failed: ${error.message}`)
      },
      onSettled: () => {
        setLoading(false)
      }
    })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
            <Globe className="w-12 h-12 mx-auto text-primary-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('connectWallet')}</h2>
            <p className="text-secondary-600 mb-6">
              Connect your wallet to access AfriCropDAO features
            </p>
            <ConnectKitButton.Custom>
              {({ show }) => (
                <button 
                  onClick={show}
                  className="btn btn-primary px-6 py-3"
                >
                  Connect Wallet
                </button>
              )}
            </ConnectKitButton.Custom>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <div className="text-center">
              <TreePine className="w-12 h-12 mx-auto text-primary-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Register as Farmer</h2>
              <p className="text-secondary-600 mb-6">
                Register to start using AfriCropDAO and access all features
              </p>
              <button 
                onClick={registerFarmer}
                disabled={loading}
                className="btn btn-primary w-full py-3"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : 'Register Now'}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{t('welcome')}</h1>
            <p className="text-secondary-600 mt-2">
              Manage your farming activities and participate in the DAO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title={t('reputationPoints')}
              value={farmer?.reputationPoints?.toString() || '0'}
              icon={<Scale className="w-5 h-5 text-primary-500" />}
            />
            <StatsCard
              title={t('sustainabilityScore')}
              value={farmer?.sustainabilityScore?.toString() || '0'}
              icon={<Globe className="w-5 h-5 text-green-500" />}
            />
            <StatsCard
              title={t('knowledgePoints')}
              value={farmer?.knowledgePoints?.toString() || '0'}
              icon={<BookOpen className="w-5 h-5 text-blue-500" />}
            />
            <StatsCard
              title={t('harvestPoints')}
              value={farmer?.harvestPoints?.toString() || '0'}
              icon={<Crop className="w-5 h-5 text-yellow-500" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title={t('myFarm')}
              value={farmCrops?.length || 0}
              description={`${t('activeLands')} planted`}
              icon={<TreePine className="w-6 h-6" />}
              link="/farm"
            />
            <DashboardCard
              title={t('mySilo')}
              value={siloCrops?.length || 0}
              description={`${t('storedCrops')} ready`}
              icon={<Package className="w-6 h-6" />}
              link="/silo"
            />
            <DashboardCard
              title={t('marketplace')}
              value={activeListings?.length || 0}
              description={t('activeListings')}
              icon={<ShoppingBag className="w-6 h-6" />}
              link="/market"
            />
            <DashboardCard
              title="DAO Members"
              value={daoMembers?.length || 0}
              description="Community farmers"
              icon={<Users className="w-6 h-6" />}
              link="/dao"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function DashboardCard({ 
  title, 
  value, 
  description, 
  icon, 
  link 
}: { 
  title: string, 
  value: number,
  description: string, 
  icon: React.ReactNode,
  link: string 
}) {
  return (
    <a 
      href={link}
      className="block bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h2>
          <p className="text-3xl font-bold text-primary-600 mb-2">{value}</p>
          <p className="text-secondary-600">{description}</p>
        </div>
        <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
          {icon}
        </div>
      </div>
    </a>
  )
}