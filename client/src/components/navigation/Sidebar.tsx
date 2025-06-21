import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Sprout, ShoppingCart, Landmark, BookOpen, Leaf, Warehouse, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const t = useTranslations('Navigation')
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
    <aside 
      className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-primary-100 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } ${isMobile && !collapsed ? 'shadow-lg' : ''}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-16 border-b border-primary-100 px-4`}>
          {!collapsed && (
            <Link href="/" className="flex items-center">
              <Image 
                src="/africrop-logo.jpg" 
                alt="AfriCrop DAO Logo"
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
              <span className="text-xl font-bold text-primary-600">AfriCrop DAO</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary-500 hover:text-primary-700"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                    title={collapsed ? link.label : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    {!collapsed && <span className="ml-3">{link.label}</span>}
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