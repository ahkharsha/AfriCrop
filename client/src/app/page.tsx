// client/src/app/page.tsx
import { useTranslation } from '../hooks/useTranslation';
import Link from 'next/link';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-[var(--color-dark)] mb-4">
          {t('welcome.title', 'Welcome to AfriCrop DAO')}
        </h1>
        <p className="text-xl text-[var(--color-text-light)] mb-8 max-w-2xl mx-auto">
          {t('welcome.subtitle', 'Empowering African farmers through decentralized governance and sustainable agriculture')}
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard" className="agri-btn-primary">
            {t('welcome.getStarted', 'Get Started')}
          </Link>
          <Link href="/education" className="agri-btn-secondary">
            {t('welcome.learnMore', 'Learn More')}
          </Link>
        </div>
      </section>
      
      <section className="grid md:grid-cols-3 gap-8 py-8">
        <div className="agri-card">
          <h3 className="text-xl font-semibold mb-2">
            {t('features.sustainability', 'Sustainable Farming')}
          </h3>
          <p>
            {t('features.sustainabilityDesc', 'Earn rewards for eco-friendly practices and carbon reduction')}
          </p>
        </div>
        <div className="agri-card">
          <h3 className="text-xl font-semibold mb-2">
            {t('features.community', 'Community Governance')}
          </h3>
          <p>
            {t('features.communityDesc', 'Participate in decisions that shape the future of agriculture')}
          </p>
        </div>
        <div className="agri-card">
          <h3 className="text-xl font-semibold mb-2">
            {t('features.education', 'Farmer Education')}
          </h3>
          <p>
            {t('features.educationDesc', 'Access knowledge and best practices from across Africa')}
          </p>
        </div>
      </section>
    </div>
  );
}