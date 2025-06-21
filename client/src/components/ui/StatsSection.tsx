import { Counter } from './Counter'

const stats = [
  { value: 2500, label: "Registered Farmers", suffix: "+" },
  { value: 12000, label: "Crops Tracked", suffix: "+" },
  { value: 350, label: "Proposals Passed", suffix: "+" },
  { value: 95, label: "Sustainability Score", suffix: "%" }
]

export function StatsSection() {
  return (
    <section className="py-20 bg-primary-green/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary-green mb-2">
                <Counter from={0} to={stat.value} duration={2} />
                {stat.suffix}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}