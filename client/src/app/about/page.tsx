import { Metadata } from 'next'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'About AfriCrop DAO',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">About AfriCrop DAO</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p>
              AfriCrop DAO is revolutionizing African agriculture through decentralized governance, 
              empowering farmers with direct market access, climate-smart techniques, and community-driven 
              innovation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">1. Register</h3>
                <p className="text-muted-foreground">
                  Farmers connect their wallet and create an on-chain profile
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">2. Farm</h3>
                <p className="text-muted-foreground">
                  Track crops through each growth stage and record yields
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">3. Earn</h3>
                <p className="text-muted-foreground">
                  Sell produce directly and earn reputation points
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">The Team</h2>
            <p>
              Founded by agricultural technologists and blockchain developers across Africa, 
              our team is committed to building equitable solutions for smallholder farmers.
            </p>
          </section>
        </div>
      </Card>
    </div>
  )
}