// src/app/page.tsx
'use client'

import { useAccount } from 'wagmi'
import { useTranslations } from '../utils/i18n'
import Nav from '../components/Nav'
import Footer from '@/components/Footer'

export default function Home() {
  const { isConnected } = useAccount()
  const t = useTranslations()

  return (
    <div>
      <Nav />
      <main className="py-8">
        <h1 className="text-3xl font-bold mb-6">{t('welcome')}</h1>

        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title={t('myCrops')}
              description={t('manageYourCrops')}
              link="/crops"
            />
            <DashboardCard
              title={t('marketplace')}
              description={t('buySellCrops')}
              link="/market"
            />
            <DashboardCard
              title={t('governance')}
              description={t('participateInDAO')}
              link="/govern"
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg mb-4">{t('connectWallet')}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function DashboardCard({ title, description, link }: { title: string, description: string, link: string }) {
  return (
    <a href={link} className="block bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-secondary-600">{description}</p>
    </a>
  )
}