import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LanguageToggle } from '../education/LanguageToggle'

export const Footer = () => {
  const t = useTranslations('Navigation')
  
  return (
    <footer className="bg-primary-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AfriCrop DAO</h3>
            <p className="text-primary-200">{t('footerDescription')}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-primary-200 hover:text-white">{t('dashboard')}</Link></li>
              <li><Link href="/marketplace" className="text-primary-200 hover:text-white">{t('marketplace')}</Link></li>
              <li><Link href="/education" className="text-primary-200 hover:text-white">{t('education')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('resources')}</h4>
            <ul className="space-y-2">
              <li><Link href="/governance" className="text-primary-200 hover:text-white">{t('governance')}</Link></li>
              <li><Link href="/climate" className="text-primary-200 hover:text-white">{t('climate')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('language')}</h4>
            <LanguageToggle />
          </div>
        </div>
        <div className="border-t border-primary-700 mt-8 pt-6 text-sm text-primary-300">
          <p>© {new Date().getFullYear()} AfriCrop DAO. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  )
}