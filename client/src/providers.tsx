'use client'

import { createConfig, WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'AfriCrop DAO',
    chains: [sepolia],
    appDescription: 'Agricultural Governance Platform',
    appUrl: 'https://africrop.vercel.app',
  })
)

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="soft">
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}