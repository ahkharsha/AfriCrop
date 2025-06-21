import { Button } from './button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative earth-gradient text-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering African Farmers Through Blockchain
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join the decentralized agricultural revolution - track crops, earn rewards, and govern the future of farming
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary-green hover:bg-gray-100">
              <Link href="/dashboard">
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-20 w-64 h-64 bg-[#F4E285] rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-[#8DB38B] rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>
    </section>
  )
}