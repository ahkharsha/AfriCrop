'use client'

import * as React from 'react'
import { WagmiConfig, createConfig, configureChains, sepolia } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()]
)

const config = createConfig(
  getDefaultConfig({
    appName: 'AfriCrop DAO',
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    chains,
    publicClient,
    webSocketPublicClient,
  })
)

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode
  locale: string
  messages: any
}) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="rounded">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}