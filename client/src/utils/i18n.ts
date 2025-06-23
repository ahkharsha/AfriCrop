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

const resources = {
  en: { translation: en },
  sw: { translation: sw },
  ha: { translation: ha },
  fr: { translation: fr },
  ar: { translation: ar }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
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
      bindI18n: 'languageChanged',
      bindI18nStore: '',
    }
  })

export const useTranslations = () => {
  return (key: string) => i18n.t(key)
}

export const useLanguage = () => ({
  lang: i18n.language,
  setLang: (lng: string) => {
    i18n.changeLanguage(lng)
    document.cookie = `i18next=${lng};path=/;max-age=31536000`
  }
})

export default i18n