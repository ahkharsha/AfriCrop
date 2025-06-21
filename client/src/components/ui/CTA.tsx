import { Button } from './button'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="py-20 bg-secondary-brown/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Farming?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of farmers already benefiting from decentralized agriculture
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary-green hover:bg-primary-green-dark">
            <Link href="/dashboard">
              Connect Wallet
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">
              Learn How It Works
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}