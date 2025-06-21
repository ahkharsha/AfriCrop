import React from 'react'
import { useTranslations } from 'next-intl'
import { ProgressRing } from '../ui/ProgressRing'

interface VotingPowerProps {
  reputation: number
  sustainability: number
  knowledge: number
}

export const VotingPower: React.FC<VotingPowerProps> = ({
  reputation,
  sustainability,
  knowledge,
}) => {
  const t = useTranslations('Governance')
  const votingPower = Math.sqrt(reputation) * (1 + (sustainability / 100) + (knowledge / 500))
  const maxPower = 100 // Example max power

  return (
    <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg">
      <ProgressRing
        progress={(votingPower / maxPower) * 100}
        size={80}
        strokeWidth={6}
      />
      <div>
        <h4 className="text-lg font-semibold text-primary-700">
          {t('votingPower')}
        </h4>
        <p className="text-sm text-secondary-600">
          {Math.round(votingPower)} / {maxPower}
        </p>
        <p className="text-xs text-secondary-500 mt-1">
          {t('votingFormula')}
        </p>
      </div>
    </div>
  )
}