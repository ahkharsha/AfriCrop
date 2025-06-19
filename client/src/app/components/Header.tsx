// client/src/components/Header.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import WalletButton from './WalletButton';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const router = useRouter();
  
  const navLinks = [
    { href: '/dashboard', label: 'dashboard' },
    { href: '/crops', label: 'crops' },
    { href: '/education', label: 'education' },
    { href: '/governance', label: 'governance' },
    { href: '/profile', label: 'profile' },
  ];

  return (
    <header className="bg-[var(--color-dark)] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">AfriCrop DAO</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`hover:text-[var(--color-accent)] transition ${
                router.pathname === link.href ? 'text-[var(--color-accent)] font-medium' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}