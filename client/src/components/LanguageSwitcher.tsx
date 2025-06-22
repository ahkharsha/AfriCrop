// src/components/LanguageSwitcher.tsx (1)
'use client'

import { useLanguage } from '../utils/i18n'
import { Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'sw', name: 'Swahili' },
    { code: 'ha', name: 'Hausa' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ]

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline-block text-sm">
          {languages.find(l => l.code === lang)?.name}
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 border border-secondary-200">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLang(language.code)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 hover:bg-primary-50 ${
                lang === language.code 
                  ? 'text-primary-600 font-medium bg-primary-50' 
                  : 'text-secondary-700'
              }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}