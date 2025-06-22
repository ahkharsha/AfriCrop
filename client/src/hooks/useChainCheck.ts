import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const useChainCheck = () => {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const { switchChain } = useSwitchChain()
  
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

  const isCorrectChain = chainId === sepolia.id
  // const isCorrectChain = chainId === apeChain.id

  const handleSwitchChain = async () => {
    try {
      await switchChain({ chainId: sepolia.id })
      // await switchChain({ chainId: apeChain.id })
    } catch (error) {
      console.error('Failed to switch chain:', error)
    }
  }

  return {
    isConnected,
    isCorrectChain,
    currentChainId: chainId,
    targetChain: sepolia,
    // targetChain: apeChain,
    switchChain: handleSwitchChain
  }
}