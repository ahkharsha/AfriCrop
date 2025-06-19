// client/src/components/WalletButton.tsx
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

export default function WalletButton() {
  const { connect } = useConnect({
    connector: walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
  });
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button 
        onClick={() => disconnect()}
        className="agri-btn-secondary"
      >
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </button>
    );
  }

  return (
    <button 
      onClick={() => connect()}
      className="agri-btn-primary"
    >
      Connect Wallet
    </button>
  );
}