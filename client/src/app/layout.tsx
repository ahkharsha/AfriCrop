import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.css'
import { Providers } from '../lib/clientProviders'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AfriCrop DAO',
  description: 'Decentralized Agricultural Governance Platform',
}

export function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-earth-50 dark:bg-earth-900 text-earth-900 dark:text-earth-50 min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}