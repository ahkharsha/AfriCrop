// src/components/Nav.tsx (1)
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectKitButton } from 'connectkit'
import { useTranslations } from '../utils/i18n'
import LanguageSwitcher from './LanguageSwitcher'
import Image from 'next/image'

export default function Nav() {
  const pathname = usePathname()
  const t = useTranslations()

  const links = [
    { href: '/', label: t('home') },
    { href: '/farm', label: t('myCrops') },
    { href: '/silo', label: t('silo') },
    { href: '/market', label: t('marketplace') },
    { href: '/dao', label: 'DAO' },
    { href: '/learn', label: t('education') }
  ]

  return (
    <nav className="bg-white border-b border-secondary-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/africrop-logo.jpg"
                alt="AfriCropDAO Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="ml-2 text-xl font-bold text-primary-700 hidden sm:block">
                AfriCropDAO
              </span>
            </Link>
            
            <div className="hidden md:block ml-8">
              <div className="flex space-x-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${
                      pathname === link.href
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-secondary-600 hover:text-primary-700 hover:bg-primary-50'
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <ConnectKitButton 
              theme="soft"
              label="Connect Wallet"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}