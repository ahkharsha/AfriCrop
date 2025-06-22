// src/components/Nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectKitButton } from 'connectkit'
import { useTranslations } from '../utils/i18n'
import LanguageSwitcher from './LanguageSwitcher'

export default function Nav() {
  const pathname = usePathname()
  const t = useTranslations()

  const links = [
    { href: '/', label: t('home') },
    { href: '/crops', label: t('crops') },
    { href: '/market', label: t('marketplace') },
    { href: '/govern', label: t('governance') },
    { href: '/learn', label: t('education') },
    { href: '/climate', label: t('sustainability') },
    { href: '/silo', label: t('silo') }
  ]

  return (
    <nav className="flex items-center justify-between py-4 border-b border-secondary-200 mb-8 px-4">
      <div className="flex items-center space-x-8">
        <Link href="/" className="font-bold text-xl">
          AfriCropDAO
        </Link>
        <div className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                pathname === link.href 
                  ? 'text-primary-600 font-medium' 
                  : 'text-secondary-600 hover:text-primary-600'
              } transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <ConnectKitButton />
      </div>
    </nav>
  )
}