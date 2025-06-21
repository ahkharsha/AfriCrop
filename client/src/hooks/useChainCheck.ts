import { useAccount, useNetwork } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const useChainCheck = () => {
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  
  // For production, we'll uncomment this and comment the Sepolia check
  // const apeChain = {
  //   id: 33111,
  //   name: 'ApeChain',
  //   network: 'apechain',
  //   nativeCurrency: {
  //     decimals: 18,
  //     name: 'ApeCoin',
  //     symbol: 'APE',
  //   },
  //   rpcUrls: {
  //     default: { http: ['https://apechain.rpc.caldera.xyz/http'] },
  //   },
  //   blockExplorers: {
  //     default: { name: 'ApeScan', url: 'https://apescan.io' },
  //   },
  // }

  const isCorrectChain = chain?.id === sepolia.id
  // const isCorrectChain = chain?.id === apeChain.id

  return {
    isConnected,
    isCorrectChain,
    currentChain: chain,
    targetChain: sepolia,
    // targetChain: apeChain,
  }
}