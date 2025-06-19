// client/src/config/chains.ts
import { sepolia } from 'wagmi/chains';

export const SUPPORTED_CHAINS = [sepolia];
export const DEFAULT_CHAIN = sepolia;

export const CHAIN_INFO = {
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    logo: '/images/sepolia-logo.png',
    explorer: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://rpc.sepolia.org',
  },
  // Commented out for future ApeChain integration
  /*
  33111: {
    name: 'ApeChain',
    logo: '/images/apechain-logo.png',
    explorer: 'https://curtis.explorer.caldera.xyz/',
    rpcUrl: 'https://curtis.rpc.caldera.xyz/http',
  },
  */
};