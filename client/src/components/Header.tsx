"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ConnectWallet from './ConnectWallet';
import { useTranslation } from 'react-i18next';
import { Globe, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMobileMenuOpen(false); // Close menu after selection
  };

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('dashboard'), href: '/dashboard' },
    { name: t('governance'), href: '/dao/proposals' },
    { name: t('land_management'), href: '/land-management/parcels' },
    { name: t('challenges'), href: '/performance-challenges/leagues' },
    { name: t('market_insights'), href: '/market-insights/commodity-futures' },
    { name: t('digital_assets'), href: '/nft-marketplace/collections' },
    { name: t('finance'), href: '/defi/yield-farming' },
    { name: t('community'), href: '/community/discussions' },
    { name: t('profile'), href: '/profile' },
  ];

  return (
    <header className="bg-afriGreen-900 text-white p-4 shadow-lg sticky top-0 z-50 rounded-b-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and App Name */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/africrop-logo.jpg"
            alt="AfriCrop DAO Logo"
            width={40}
            height={40}
            className="rounded-full shadow-md"
          />
          <span className="text-xl md:text-2xl font-bold text-afriGold-300">
            {t('app_name')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-grow justify-center">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-afriGreen-100 hover:text-afriGold-300 transition-colors text-base font-medium px-3 py-2 rounded-md"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section: Language and Wallet Connect */}
        <div className="flex items-center space-x-4">
          {/* Language Selector (Desktop) */}
          <div className="hidden md:block relative">
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              className="appearance-none bg-afriGreen-800 text-white py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-afriGold-500 focus:border-afriGold-500 text-sm cursor-pointer"
            >
              <option value="en">{t('en')}</option>
              <option value="sw">{t('sw')}</option>
              <option value="ha">{t('ha')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <Globe className="h-4 w-4" />
            </div>
          </div>

          <div className="hidden md:block">
            <ConnectWallet />
          </div>

          {/* Mobile Menu Button */}
          <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <DialogTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-afriGreen-700">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="fixed inset-y-0 right-0 h-full w-2/3 max-w-sm flex flex-col bg-afriGreen-950 text-white p-6 animate-slideInRight sm:max-w-xs">
              <DialogHeader className="text-left">
                <DialogTitle className="text-afriGold-300 text-2xl font-bold mb-4">{t('app_name')}</DialogTitle>
              </DialogHeader>
              <nav className="flex flex-col space-y-4 flex-grow">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg text-afriGreen-100 hover:text-afriGold-300 transition-colors py-2 border-b border-afriGreen-700 last:border-b-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 pt-4 border-t border-afriGreen-700">
                <ConnectWallet />
                <div className="mt-4">
                  <h4 className="text-afriGreen-100 text-sm mb-2">{t('language_selector')}</h4>
                  <select
                    onChange={(e) => changeLanguage(e.target.value)}
                    value={i18n.language}
                    className="w-full appearance-none bg-afriGreen-800 text-white py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-afriGold-500 focus:border-afriGold-500 text-sm cursor-pointer"
                  >
                    <option value="en">{t('en')}</option>
                    <option value="sw">{t('sw')}</option>
                    <option value="ha">{t('ha')}</option>
                  </select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;