import { createConfig, http } from '@wagmi/core'
import { sepolia } from '@wagmi/core/chains'
import { injected, walletConnect } from '@wagmi/connectors'

// Configure Wagmi
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(), // Metamask, Coinbase Wallet, etc.
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID',
      showQrModal: true,
    }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'),
  },
})

// Optional: Web3Modal setup (for a cleaner UI for wallet connection)
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID';

// 2. Set chains
const sepoliaChain = {
  chainId: sepolia.id,
  name: sepolia.name,
  currency: sepolia.nativeCurrency.symbol,
  explorerUrl: sepolia.blockExplorers?.etherscan?.url,
  rpcUrl: sepolia.rpcUrls.default.http[0],
};

// 3. Create a metadata object
const metadata = {
  name: 'AfriCrop DAO',
  description: 'Revolutionary Agricultural Governance Platform',
  url: 'https://africropdao.vercel.app', // Your project website
  icons: ['https://africropdao.vercel.app/africrop-logo.jpg'] // Your project icon
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true, // Optional - enable EIP6963
  enableInjected: true, // Optional - enable injected wallets
  enableCoinbase: true, // Optional - enable coinbase wallet
  rpcUrl: sepoliaChain.rpcUrl, // Optional - your target wallet connect rpcUrl
  defaultChainId: sepoliaChain.chainId // Optional - your target wallet connect chainId
})


// 5. Create a Web3Modal instance
export const web3modal = createWeb3Modal({
  ethersConfig,
  chains: [sepoliaChain],
  projectId,
  enableAnalytics: true // Optional - defaults to your WalletConnect Cloud dashboard settings
})