"use client";

import React from 'react';
import { Button } from './ui/button';
import { useWeb3Modal } from '@web3modal/ethers/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useTranslation } from 'react-i18next';

const ConnectWallet: React.FC = () => {
  const { t } = useTranslation();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <span className="text-afriGreen-800 dark:text-afriGreen-200 text-sm font-medium">
            {t('connected')}: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
          </span>
          <Button onClick={() => disconnect()} variant="outline" size="sm" className="border-afriBrown-300 text-afriBrown-700 hover:bg-afriBrown-50">
            {t('disconnect_wallet')}
          </Button>
        </div>
      ) : (
        <Button onClick={() => open()} className="bg-afriGreen-500 hover:bg-afriGreen-600 text-white">
          {t('connect_wallet')}
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;