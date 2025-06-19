"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Leaf, Handshake, Map, Award, Gem, BarChart, Users, Wallet } from 'lucide-react'; // Icons

export default function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('reputation_system_title'),
      description: t('reputation_system_desc'),
      icon: Leaf,
      link: "/dashboard"
    },
    {
      title: t('dao_governance_title'),
      description: t('dao_governance_desc'),
      icon: Handshake,
      link: "/dao/proposals"
    },
    {
      title: t('land_management_title'),
      description: t('land_management_desc'),
      icon: Map,
      link: "/land-management/parcels"
    },
    {
      title: t('performance_challenges_title'),
      description: t('performance_challenges_desc'),
      icon: Award,
      link: "/performance-challenges/leagues"
    },
    {
      title: t('nft_marketplace_title'),
      description: t('nft_marketplace_desc'),
      icon: Gem,
      link: "/nft-marketplace/collections"
    },
    {
      title: t('defi_yield_farming_title'),
      description: t('defi_yield_farming_desc'),
      icon: Wallet,
      link: "/defi/yield-farming"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] bg-afriBrown-50 py-12 rounded-xl shadow-lg">
      {/* Hero Section */}
      <section className="text-center mb-16 px-4 max-w-4xl">
        <Image
          src="/africrop-logo.png"
          alt="AfriCrop DAO Logo"
          width={120}
          height={120}
          className="mx-auto mb-6 rounded-full shadow-lg border-4 border-afriGreen-500"
        />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-afriGreen-800 mb-6 leading-tight">
          {t('app_name')}
        </h1>
        <p className="text-xl sm:text-2xl text-afriGreen-700 mb-8 font-semibold">
          {t('slogan')}
        </p>
        <p className="text-lg sm:text-xl text-afriBrown-700 max-w-2xl mx-auto mb-10">
          {t('hero_description_1')} <br />
          {t('hero_description_2')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/dashboard" passHref>
            <Button size="lg" className="bg-afriGreen-600 hover:bg-afriGreen-700 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
              {t('explore_dashboard')}
            </Button>
          </Link>
          <Link href="/dao/proposals" passHref>
            <Button size="lg" variant="outline" className="border-afriGreen-600 text-afriGreen-600 hover:bg-afriGreen-50 shadow-xl transform hover:scale-105 transition-transform duration-300">
              {t('view_proposals')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-afriGreen-800 mb-12">
          Core Platform Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-center p-3 rounded-full bg-afriGreen-100 text-afriGreen-600 mb-4 mx-auto w-16 h-16">
                  <feature.icon size={32} />
                </div>
                <CardTitle className="text-center text-afriGreen-700 text-2xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <CardDescription className="text-afriBrown-600 mb-6 min-h-[60px] flex items-center justify-center">
                  {feature.description}
                </CardDescription>
                <Link href={feature.link} passHref>
                  <Button variant="outline" className="border-afriGold-500 text-afriGold-700 hover:bg-afriGold-50">
                    {index === 0 && t('explore_dashboard')}
                    {index === 1 && t('view_proposals')}
                    {index === 2 && t('enter_land_management')}
                    {index === 3 && t('join_challenges')}
                    {index === 4 && t('browse_nfts')}
                    {index === 5 && t('start_earning')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}