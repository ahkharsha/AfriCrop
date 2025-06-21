'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnect } from './WalletConnect'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Crops', href: '/crops' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Governance', href: '/governance' },
  { name: 'Education', href: '/education' },
  { name: 'Climate', href: '/climate' },
  { name: 'Silo', href: '/silo' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="earth-gradient text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary-green-dark font-bold text-xl">AC</span>
            </div>
            <h1 className="text-xl font-bold hidden sm:block">AfriCrop DAO</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                className={cn(
                  'text-white hover:bg-white/10',
                  pathname === link.href ? 'bg-white/20' : ''
                )}
              >
                <Link href={link.href}>{link.name}</Link>
              </Button>
            ))}
          </nav>

          {/* Mobile menu button would go here */}

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <WalletConnect />
          </div>
        </div>

        {/* Mobile Navigation (would be toggled) */}
        <div className="md:hidden pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block px-3 py-2 rounded-md text-sm font-medium',
                pathname === link.href
                  ? 'bg-white/20 text-white'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}