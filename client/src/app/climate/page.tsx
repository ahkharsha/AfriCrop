// src/app/climate/page.tsx
'use client'

import { useAccount, useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import StatsCard from '@/components/StatsCard'
import { Leaf, Award, Droplet, Cloud } from 'lucide-react'

export default function ClimatePage() {
  const { address } = useAccount()
  const t = useTranslations()
  
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

  return (
    <div>
      <Nav />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Sustainability Dashboard</h1>
          <p className="text-secondary-600 mb-8">
            Track your environmental impact and compare with other farmers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Your Sustainability Score"
              value={farmer ? farmer[2].toString() : '0'}
              icon={<Leaf className="w-5 h-5 text-green-500" />}
              trend="up"
            />
            <StatsCard
              title="Knowledge Points"
              value={farmer ? farmer[3].toString() : '0'}
              icon={<Award className="w-5 h-5 text-blue-500" />}
              trend="neutral"
            />
            <StatsCard
              title="Water Conservation"
              value="85%"
              icon={<Droplet className="w-5 h-5 text-blue-400" />}
              trend="up"
            />
            <StatsCard
              title="Carbon Footprint"
              value="Low"
              icon={<Cloud className="w-5 h-5 text-gray-500" />}
              trend="down"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card title="Sustainability Leaderboard">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200">
                        <th className="text-left py-3 px-4">Rank</th>
                        <th className="text-left py-3 px-4">Farmer</th>
                        <th className="text-right py-3 px-4">Score</th>
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
                            {farmerAddress === address ? 'You' : `${farmerAddress.substring(0, 6)}...${farmerAddress.substring(38)}`}
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
              <Card title="Tips to Improve">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Crop Rotation</h4>
                    <p className="text-sm text-secondary-600">
                      Rotate between different crop types each season to maintain soil health.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Water Conservation</h4>
                    <p className="text-sm text-secondary-600">
                      Use drip irrigation systems to reduce water usage by up to 30%.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Organic Fertilizers</h4>
                    <p className="text-sm text-secondary-600">
                      Replace chemical fertilizers with compost to improve soil quality.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}