'use client'

import * as React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { WagmiConfig } from 'wagmi'
import { ConnectKitProvider } from 'connectkit'
import { config } from '@/lib/wagmi'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  messages: any // Consider using a more specific type if possible
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}