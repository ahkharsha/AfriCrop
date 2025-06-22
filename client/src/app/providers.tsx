// src/app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../utils/contract'
import { ConnectKitProvider } from 'connectkit'
import { curtis, flowTestnet } from 'wagmi/chains'
import { useAccount, useSwitchChain } from 'wagmi'
import { useModal } from 'connectkit'
import { useEffect } from 'react'

// Create a client
const queryClient = new QueryClient()

function ChainValidator({ children }: { children: React.ReactNode }) {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const { setOpen } = useModal()

  // Use this for APE CHAIN
  
  // useEffect(() => {
  //   if (chain && chain.id !== curtis.id) {
  //     const shouldSwitch = confirm('Please switch to Curtis Testnet (Chain ID 33111)')
  //     if (shouldSwitch) {
  //       switchChain({ chainId: curtis.id })
  //     }
  //     setOpen(true)
  //   }
  // }, [chain, switchChain, setOpen])

  useEffect(() => {
    if (chain && chain.id !== flowTestnet.id) {
      const shouldSwitch = confirm('Please switch to Curtis Testnet (Chain ID 33111)')
      if (shouldSwitch) {
        switchChain({ chainId: flowTestnet.id })
      }
      setOpen(true)
    }
  }, [chain, switchChain, setOpen])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <ChainValidator>
            {children}
          </ChainValidator>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}