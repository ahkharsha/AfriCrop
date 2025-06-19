import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from '../locales/en/translation.json';
import swTranslation from '../locales/sw/translation.json';
import haTranslation from '../locales/ha/translation.json';

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      sw: {
        translation: swTranslation,
      },
      ha: {
        translation: haTranslation,
      },
    },
    fallbackLng: 'en', // Fallback language if user's language is not available
    debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
    interpolation: {
      escapeValue: false, // React already escapes values, so no need for i18n to do it
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;