// src/components/Footer.tsx (1)
import { useTranslations } from '../utils/i18n'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations()
  
  return (
    <footer className="bg-primary-800 text-white py-8 border-t border-primary-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4">
            <Image 
              src="/africrop-logo.jpg" 
              alt="AfriCropDAO Logo" 
              width={50} 
              height={50}
              className="rounded-full"
            />
            <div>
              <h3 className="font-bold text-lg">AfriCropDAO</h3>
              <p className="text-primary-300 text-sm mt-1">
                Sustainable farming through blockchain
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm text-primary-300">
                <li><Link href="/farm" className="hover:text-white transition-colors">My Farm</Link></li>
                <li><Link href="/market" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/dao" className="hover:text-white transition-colors">DAO</Link></li>
                <li><Link href="/learn" className="hover:text-white transition-colors">Education</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-primary-300">
                <li><Link href="#" className="hover:text-white transition-colors">Docs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Whitepaper</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">GitHub</Link></li>
              </ul>
            </div>
          </div>

          <div className="text-right md:text-center lg:text-right">
            <p className="text-primary-300">
              © {new Date().getFullYear()} AfriCropDAO
            </p>
            <p className="text-primary-400 text-sm mt-1">
              Building the future of sustainable agriculture
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}