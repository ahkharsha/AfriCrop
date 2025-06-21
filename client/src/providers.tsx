'use client'

import * as React from 'react'
import { WagmiConfig } from 'wagmi'
import { config } from '@/lib/wagmi'
import { ConnectKitProvider } from 'connectkit'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

export function Providers({
  children,
  locale,
  messages
}: {
  children: React.ReactNode
  locale: string
  messages: any
}) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        theme="rounded"
        options={{
          initialChainId: 0, // Allow all chains
          disclaimer: (
            <>
              By connecting your wallet, you agree to the{' '}
              <a target="_blank" rel="noopener noreferrer" href="/terms">
                Terms of Service
              </a>{' '}
              and acknowledge you have read and understand the{' '}
              <a target="_blank" rel="noopener noreferrer" href="/disclaimer">
                Protocol Disclaimer
              </a>
              .
            </>
          )
        }}
      >
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
          timeZone="UTC"
          now={new Date()}
        >
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}