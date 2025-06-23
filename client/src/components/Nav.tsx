// src/components/Nav.tsx (1)
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectKitButton } from 'connectkit'
import { useTranslations } from '../utils/i18n'
import LanguageSwitcher from './LanguageSwitcher'
import Image from 'next/image'
import { useAccount } from 'wagmi'

export default function Nav() {
  const pathname = usePathname()
  const t = useTranslations()
  const { isConnected } = useAccount()

  const links = [
    { href: '/', label: t('home') },
    { href: '/farm', label: t('myCrops') },
    { href: '/market', label: t('marketplace') },
    { href: '/dao', label: 'DAO' },
    { href: '/learn', label: t('education') },
    { href: '/climate', label: t('sustainability') },
    { href: '/silo', label: t('silo') }
  ]

  return (
    <nav className="bg-primary-800 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/africrop-logo.jpg" 
              alt="AfriCropDAO Logo" 
              width={40} 
              height={40}
              className="rounded-full"
            />
            <span className="font-bold text-xl hidden sm:inline">AfriCropDAO</span>
          </Link>
          
          {isConnected && (
            <div className="hidden md:flex space-x-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href 
                      ? 'text-white font-semibold border-b-2 border-white' 
                      : 'text-primary-200 hover:text-white'
                  } transition-colors px-2 py-1`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <ConnectKitButton 
            theme="rounded"
            label={t('connectWallet')}
          />
        </div>
      </div>
    </nav>
  )
}