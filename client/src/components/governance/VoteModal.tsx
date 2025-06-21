import React from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface VoteModalProps {
  isOpen: boolean
  onClose: () => void
  onVote: (vote: boolean) => void
  proposal: {
    id: number
    title: string
  }
  votingPower: number
}

export const VoteModal: React.FC<VoteModalProps> = ({
  isOpen,
  onClose,
  onVote,
  proposal,
  votingPower,
}) => {
  const t = useTranslations('Governance')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('castVote')}>
      <div className="space-y-6">
        <p className="text-primary-700">
          {t('votingFor')} <strong>#{proposal.id} - {proposal.title}</strong>
        </p>
        <p className="text-sm text-secondary-600">
          {t('votingPower')}: {votingPower}
        </p>

        <div className="flex justify-center gap-6">
          <Button
            variant="accent"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => onVote(true)}
          >
            {t('voteYes')}
          </Button>
          <Button
            variant="accent"
            className="bg-red-500 hover:bg-red-600"
            onClick={() => onVote(false)}
          >
            {t('voteNo')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}