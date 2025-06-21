import React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Select } from '../ui/Select'

export const LanguageToggle = () => {
  const router = useRouter()
  const t = useTranslations('Navigation')

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value
    router.push(`/${locale}`)
  }

  return (
    <Select
      onChange={changeLanguage}
      defaultValue={t('currentLanguage')}
      className="w-24"
    >
      <option value="en">{t('english')}</option>
      <option value="fr">{t('french')}</option>
      <option value="sw">{t('swahili')}</option>
      <option value="ha">{t('hausa')}</option>
      <option value="ar">{t('arabic')}</option>
    </Select>
  )
}