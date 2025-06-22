import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { type Proposal } from '@/types'
import { formatEth } from '@/lib/utils'
import { Progress } from '../ui/Progress'

interface ProposalCardProps {
  proposal: Proposal
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const t = useTranslations('Governance')
  const totalVotes = proposal.yesVotes + proposal.noVotes
  const yesPercentage = totalVotes > 0 ? 
    Number((proposal.yesVotes * BigInt(100)) / totalVotes) : 0

  // Use first 50 chars of description since title doesn't exist in contract
  const proposalTitle = proposal.description.length > 50 
    ? `${proposal.description.substring(0, 50)}...` 
    : proposal.description

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-primary-700">
            #{proposal.id.toString()} - {proposalTitle}
          </h3>
          <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded">
            {proposal.status}
          </span>
        </div>

        <p className="text-sm text-secondary-600">
          {t('type')}: {proposal.proposalType}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-600">
              {t('yes')} ({proposal.yesVotes.toString()})
            </span>
            <span className="text-red-600">
              {t('no')} ({proposal.noVotes.toString()})
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
            <p className="font-medium">
              {Number(proposal.endBlock - proposal.startBlock)} blocks
            </p>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          {t('viewDetails')}
        </Button>
      </div>
    </Card>
  )
}