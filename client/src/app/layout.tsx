import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '../providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-primary-50 text-primary-900 min-h-screen`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}