// src/utils/i18n.ts (1)
'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '../../public/locales/en.json'
import sw from '../../public/locales/sw.json'
import ha from '../../public/locales/ha.json'
import fr from '../../public/locales/fr.json'
import ar from '../../public/locales/ar.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sw: { translation: sw },
      ha: { translation: ha },
      fr: { transaction: fr },
      ar: { translation: ar }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['cookie', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    react: {
      useSuspense: false,
    }
  })

export const useTranslations = () => {
  return (key: string) => i18n.t(key)
}

export const useLanguage = () => {
  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng)
    document.cookie = `i18next=${lng};path=/;max-age=31536000`
  }

  return {
    lang: i18n.language,
    setLang: changeLanguage
  }
}

export default i18n