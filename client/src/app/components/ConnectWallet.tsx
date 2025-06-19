// src/components/ConnectWallet.tsx
"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectWallet() {
  const { isConnected } = useAccount();

  return (
    <div className="ml-2">
      <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
    </div>
  );
}
