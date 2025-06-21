import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/africrop-logo.jpg" 
                alt="AfriCrop DAO Logo"
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
              <span className="text-xl font-bold text-primary-600 hidden sm:block">
                AfriCrop DAO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
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
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-primary-600 hover:text-primary-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}