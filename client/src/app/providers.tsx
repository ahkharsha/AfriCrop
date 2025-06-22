// src/app/providers.tsx
'use client'

import { ConnectKitProvider, useModal } from 'connectkit'
import { WagmiConfig, useAccount, useSwitchChain } from 'wagmi'
import { config } from '../utils/contract'
import { curtis } from 'wagmi/chains'
import { useEffect } from 'react'

function ChainValidator({ children }: { children: React.ReactNode }) {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const { setOpen } = useModal()

  useEffect(() => {
    if (chain && chain.id !== curtis.id) {
      const shouldSwitch = confirm('Please switch to Curtis Testnet (Chain ID 33111)')
      if (shouldSwitch) {
        switchChain({ chainId: curtis.id })
      }
      setOpen(true)
    }
  }, [chain])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
          <ChainValidator>
            {children}
          </ChainValidator>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}