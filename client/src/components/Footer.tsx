"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-afriGreen-900 text-afriGreen-100 py-8 mt-12 rounded-t-lg shadow-inner">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* About Section */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-afriGold-300">
            {t('app_name')}
          </h3>
          <p className="text-sm leading-relaxed">
            {t('hero_description_2')}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-afriGold-300">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors text-sm">
                {t('dashboard')}
              </Link>
            </li>
            <li>
              <Link href="/dao/proposals" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors text-sm">
                {t('governance')}
              </Link>
            </li>
            <li>
              <Link href="/nft-marketplace/collections" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors text-sm">
                {t('digital_assets')}
              </Link>
            </li>
            <li>
              <Link href="/community/discussions" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors text-sm">
                {t('community')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-afriGold-300">
            Legal
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors text-sm">
                {t('nav_about')}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors text-sm">
                {t('nav_terms')}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors text-sm">
                {t('nav_privacy')}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors text-sm">
                {t('nav_contact')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-afriGold-300">
            Connect
          </h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-afriGreen-200 hover:text-afriGold-300 transition-colors">
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-4 border-t border-afriGreen-700 text-center text-sm text-afriGreen-400">
        &copy; {new Date().getFullYear()} {t('copyright')}
      </div>
    </footer>
  );
};

export default Footer;