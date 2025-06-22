// src/utils/i18n.ts
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
      fr: { translation: fr },
      ar: { translation: ar }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    react: {
      useSuspense: false,
    }
  })

export const useTranslations = () => {
  return (key: string) => i18n.t(key)
}

export const useLanguage = () => ({
  lang: i18n.language,
  setLang: (lng: string) => {
    i18n.changeLanguage(lng)
    window.location.reload() // Force refresh to update all text
  }
})

export default i18n