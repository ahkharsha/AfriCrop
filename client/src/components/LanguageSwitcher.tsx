// src/components/LanguageSwitcher.tsx
'use client'

import { useLanguage } from '../utils/i18n'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="bg-white border border-secondary-300 rounded-md px-3 py-1 text-sm"
    >
      <option value="en">English</option>
      <option value="sw">Swahili</option>
      <option value="ha">Hausa</option>
      <option value="fr">Français</option>
      <option value="ar">العربية</option>
    </select>
  )
}