// src/components/Footer.tsx (1)
'use client'

import { useTranslations } from '../utils/i18n'
import Image from 'next/image'
import { useAccount } from 'wagmi'

export default function Footer() {
  const t = useTranslations()
  const { isConnected } = useAccount()
  
  return (
    <footer className={`bg-primary-900 text-white py-8 ${!isConnected ? 'mt-auto' : ''}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Image 
              src="/africrop-logo.jpg" 
              alt="AfriCropDAO Logo" 
              width={50} 
              height={50}
              className="rounded-full"
            />
            <div>
              <h3 className="font-bold text-lg">AfriCropDAO</h3>
              <p className="text-primary-300 text-sm">{t('footerText')}</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-primary-300">
              © {new Date().getFullYear()} AfriCropDAO. {t('allRightsReserved')}
            </p>
            <p className="text-primary-400 text-sm mt-1">
              {t('sustainableFarming')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}