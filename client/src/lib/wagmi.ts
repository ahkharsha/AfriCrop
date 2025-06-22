import { createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    // alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

    // Required
    appName: 'AfriCrop DAO',

    // Optional
    appDescription: 'Decentralized agricultural governance platform',
    appUrl: 'https://africrop-dao.vercel.app',
    appIcon: 'https://africrop-dao.vercel.app/logo.png',
    chains: [sepolia],
  })
)