import { Card } from './card'

const features = [
  {
    title: "Crop Management",
    description: "Track your crops from sowing to harvest with blockchain-verified records",
    icon: "🌱"
  },
  {
    title: "Decentralized Marketplace",
    description: "Sell your harvest directly to buyers with minimal fees",
    icon: "🛒"
  },
  {
    title: "DAO Governance",
    description: "Vote on platform improvements and funding allocations",
    icon: "🗳️"
  },
  {
    title: "Climate Impact",
    description: "Earn rewards for sustainable farming practices",
    icon: "🌍"
  },
  {
    title: "Farmer Education",
    description: "Access agricultural knowledge and mentorship programs",
    icon: "📚"
  },
  {
    title: "Financial Inclusion",
    description: "Access credit and payments through crypto wallets",
    icon: "💳"
  }
]

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Join AfriCrop DAO?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform combines traditional farming wisdom with cutting-edge blockchain technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}