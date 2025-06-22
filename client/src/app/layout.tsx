// src/app/layout.tsx
import './globals.css'
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-primary-50 text-primary-900 min-h-screen">
        <Providers>
          <div className="max-w-6xl mx-auto px-4">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}