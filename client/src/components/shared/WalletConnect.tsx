'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { shortenAddress } from '@/lib/utils'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <Button
        onClick={openConnectModal}
        className="bg-secondary-brown hover:bg-secondary-brown-dark"
      >
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} />
            <AvatarFallback>{address?.slice(2, 6)}</AvatarFallback>
          </Avatar>
          <span>{shortenAddress(address)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => disconnect()}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}