'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'sw', name: 'Swahili' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ar', name: 'العربية' },
]

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale()

  const changeLanguage = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`)
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={currentLocale === lang.code ? 'bg-accent' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}