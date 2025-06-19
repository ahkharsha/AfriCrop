// client/src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './../styles/global.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AfriCrop DAO',
  description: 'Decentralized Agricultural Governance Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow bg-[var(--color-bg-secondary)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}