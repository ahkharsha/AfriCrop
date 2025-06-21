import React from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { formatEth } from '@/lib/utils'
import { Progress } from '../ui/Progress'

interface ProposalCardProps {
  proposal: {
    id: number
    title: string
    description: string
    status: string
    yesVotes: number
    noVotes: number
    endBlock: number
    stakeAmount: bigint
  }
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const t = useTranslations('Governance')
  const totalVotes = proposal.yesVotes + proposal.noVotes
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-primary-700">
            #{proposal.id} - {proposal.title}
          </h3>
          <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded">
            {proposal.status}
          </span>
        </div>

        <p className="text-sm text-secondary-600">{proposal.description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-600">
              {t('yes')} ({proposal.yesVotes})
            </span>
            <span className="text-red-600">
              {t('no')} ({proposal.noVotes})
            </span>
          </div>
          <Progress value={yesPercentage} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-secondary-500">{t('stake')}</p>
            <p className="font-medium">{formatEth(proposal.stakeAmount)} ETH</p>
          </div>
          <div>
            <p className="text-secondary-500">{t('endsIn')}</p>
            <p className="font-medium">{proposal.endBlock} blocks</p>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          {t('viewDetails')}
        </Button>
      </div>
    </Card>
  )
}