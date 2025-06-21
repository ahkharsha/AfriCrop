import { Metadata } from 'next'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing AfriCrop DAO, you agree to be bound by these terms and all applicable laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Farmer Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accurate crop data reporting</li>
              <li>Ethical farming practices</li>
              <li>Timely fulfillment of marketplace orders</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. DAO Governance</h2>
            <p>
              All participants agree to abide by community governance decisions made through 
              the proposal and voting system.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Dispute Resolution</h2>
            <p>
              Conflicts will be resolved through community arbitration and smart contract mediation.
            </p>
          </section>
        </div>
      </Card>
    </div>
  )
}