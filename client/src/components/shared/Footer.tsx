import Link from 'next/link'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AC</span>
            </div>
            <span className="font-semibold">AfriCrop DAO</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/about" className="text-sm hover:text-primary-green">
              About
            </Link>
            <Link href="/terms" className="text-sm hover:text-primary-green">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm hover:text-primary-green">
              Privacy
            </Link>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AfriCrop DAO. All rights reserved.
        </div>
      </div>
    </footer>
  )
}