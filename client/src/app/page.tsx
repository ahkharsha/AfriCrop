import { HeroSection } from '../components/ui/HeroSection'
import { FeaturesGrid } from '../components/ui/FeaturesGrid'
import { StatsSection } from '../components/ui/StatsSection'
import { CTA } from '../components/ui/CTA'

export default function Home() { 
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <StatsSection />
      <CTA />
    </>
  )
}