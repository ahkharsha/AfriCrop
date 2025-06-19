// client/src/components/LanguageSwitcher.tsx
'use client';

import { useRouter } from 'next/router';
import { useTranslation } from '../hooks/useTranslation';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const { setLanguage } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 text-white hover:text-[var(--color-accent)]">
        <span>{router.locale?.toUpperCase()}</span>
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 hidden group-hover:block">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`block w-full text-left px-4 py-2 hover:bg-[var(--color-light)] ${
              router.locale === lang.code ? 'bg-[var(--color-light)]' : ''
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}