"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Wagmi and Web3Modal imports
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config, web3modal } from '../lib/wagmi'; // Ensure web3modal is initialized

// i18n import
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n'; // Import the i18n configuration

const inter = Inter({ subsets: ['latin'] });

// Create a client for react-query
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={i18n.language} className="scroll-smooth">
      <head>
        <title>AfriCrop DAO</title>
        <meta name="description" content="Revolutionary Agricultural Governance Platform" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-afriBrown-50 text-afriBrown-900`}>
        <I18nextProvider i18n={i18n}>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
            </QueryClientProvider>
          </WagmiProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}