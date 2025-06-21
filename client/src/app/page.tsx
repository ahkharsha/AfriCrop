import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function Home() {
  const t = useTranslations('Index')
  
  return (
    <main className="flex flex-col items-center justify-center flex-1 p-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-primary-600">
          {t('title')}
        </h1>
        <p className="text-lg mb-8 text-secondary-600">
          {t('description')}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button variant="primary" size="lg">
              {t('getStarted')}
            </Button>
          </Link>
          <Button variant="secondary" size="lg">
            {t('learnMore')}
          </Button>
        </div>
      </div>
    </main>
  )
}