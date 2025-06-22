'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '../providers'
import { Footer } from '@/components/navigation/Footer'
import { Navbar } from '@/components/navigation/Navbar'
import { Sidebar } from '@/components/navigation/Sidebar'
import { notFound } from 'next/navigation'
import { useMessages } from 'next-intl'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'fr', 'sw', 'ha', 'ar'].includes(locale)) notFound()

  const messages = useMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-primary-50 text-primary-900 min-h-screen flex flex-col`}>
        <Providers locale={locale} messages={messages}>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-16 lg:ml-64 pt-16 transition-all duration-300">
              <div className="p-4 md:p-6">
                {children}
              </div>
            </main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}