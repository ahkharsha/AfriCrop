// client/src/hooks/useTranslation.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import i18n from '../config/i18n';

export const useTranslation = () => {
  const router = useRouter();
  const { locale } = router;

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    if (locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return { t: i18n.t, setLanguage };
};