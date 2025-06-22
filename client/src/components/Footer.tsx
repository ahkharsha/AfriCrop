// src/components/Footer.tsx
import { useTranslations } from '../utils/i18n'

export default function Footer() {
  const t = useTranslations()
  
  return (
    <footer className="border-t border-secondary-200 mt-12 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-secondary-600 text-sm">
        <p>{t('footerText')}</p>
        <p className="mt-2">© {new Date().getFullYear()} AfriCropDAO</p>
      </div>
    </footer>
  )
}