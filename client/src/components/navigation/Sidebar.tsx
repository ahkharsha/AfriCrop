import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Sprout, ShoppingCart, Landmark, BookOpen, Leaf, Warehouse } from 'lucide-react'

const Sidebar = () => {
  const t = useTranslations('Navigation')
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/crops', label: t('crops'), icon: Sprout },
    { href: '/marketplace', label: t('marketplace'), icon: ShoppingCart },
    { href: '/governance', label: t('governance'), icon: Landmark },
    { href: '/education', label: t('education'), icon: BookOpen },
    { href: '/climate', label: t('climate'), icon: Leaf },
    { href: '/silo', label: t('silo'), icon: Warehouse },
  ]

  return (
    <aside className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white border-r border-primary-100 z-40">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-primary-100">
          <span className="text-xl font-bold text-primary-600">AfriCrop DAO</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar