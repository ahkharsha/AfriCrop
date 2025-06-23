// src/components/LanguageSwitcher.tsx (1)
'use client'

import { useLanguage } from '../utils/i18n'
import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sw', name: 'Swahili' },
    { code: 'ha', name: 'Hausa' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ]

  if (!mounted) return null

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline-block text-sm">
          {languages.find(l => l.code === lang)?.name}
        </span>
      </button>
      
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => setLang(language.code)}
            className={`w-full text-left px-4 py-2 hover:bg-primary-100 ${lang === language.code ? 'text-primary-600 font-medium' : 'text-secondary-700'}`}
          >
            {language.name}
          </button>
        ))}
      </div>
    </div>
  )
}