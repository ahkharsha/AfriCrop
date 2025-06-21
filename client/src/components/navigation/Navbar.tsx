import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const t = useTranslations('Navigation')
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: t('dashboard') },
    { href: '/crops', label: t('crops') },
    { href: '/marketplace', label: t('marketplace') },
    { href: '/governance', label: t('governance') },
    { href: '/education', label: t('education') },
    { href: '/climate', label: t('climate') },
    { href: '/silo', label: t('silo') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-primary-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">AfriCrop DAO</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  pathname === link.href ? 'text-primary-600' : 'text-secondary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ConnectButton 
              accountStatus="avatar"
              chainStatus="icon"
              showBalance={false}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar