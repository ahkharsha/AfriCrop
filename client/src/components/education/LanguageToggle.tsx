'use client' 

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Select } from '../ui/Select'

export const LanguageToggle = () => {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Navigation')

  // Extract current locale from pathname (default to 'en' if not found)
  const currentLocale = pathname.split('/')[1] || 'en'

  const changeLanguage = (value: string) => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${value}`)
    router.push(newPathname)
  }

  const languageOptions = [
    { value: 'en', label: t('english') },
    { value: 'fr', label: t('french') },
    { value: 'sw', label: t('swahili') },
    { value: 'ha', label: t('hausa') },
    { value: 'ar', label: t('arabic') }
  ]

  // Find the current language label
  const currentLanguage = languageOptions.find(opt => opt.value === currentLocale)?.label || t('english')

  return (
    <Select
      value={currentLocale}
      onValueChange={changeLanguage}
      options={languageOptions}
      className="w-32"
      aria-label={t('languageSelector')}
    />
  )
}