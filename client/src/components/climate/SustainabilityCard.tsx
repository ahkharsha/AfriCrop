// components/climate/SustainabilityCard.tsx
import { Card } from '../ui/Card'
import ProgressRing from '../ui/ProgressRing'

interface SustainabilityCardProps {
  sustainabilityScore: number
}

export const SustainabilityCard: React.FC<SustainabilityCardProps> = ({ 
  sustainabilityScore 
}) => {
  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          Sustainability Score
        </h3>
        <div className="flex justify-center">
          <ProgressRing
            progress={sustainabilityScore}
            size={120}
            strokeWidth={10}
            color="var(--color-primary-500)"
          />
        </div>
        <p className="text-center mt-4 text-secondary-600">
          Your current sustainability rating
        </p>
      </div>
    </Card>
  )
}