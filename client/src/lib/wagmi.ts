import { createConfig, configureChains, sepolia } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultConfig } from 'connectkit'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()]
)

export const config = createConfig(
  getDefaultConfig({
    appName: 'AfriCrop DAO',
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    chains,
    publicClient,
    webSocketPublicClient,
  })
)