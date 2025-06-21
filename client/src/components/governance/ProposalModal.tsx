import React from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { PROPOSAL_TYPES } from '@/lib/constants'

interface ProposalModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    proposalType: string
    title: string
    description: string
    stakeAmount: number
  }) => void
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const t = useTranslations('Governance')
  const [formData, setFormData] = React.useState({
    proposalType: '',
    title: '',
    description: '',
    stakeAmount: 0.01,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('newProposal')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label={t('proposalType')}
          options={PROPOSAL_TYPES.map((type) => ({
            value: type,
            label: t(`proposalTypes.${type}`),
          }))}
          value={formData.proposalType}
          onChange={(e) =>
            setFormData({ ...formData, proposalType: e.target.value })
          }
          required
        />

        <Input
          label={t('title')}
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
        />

        <Input
          label={t('description')}
          as="textarea"
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <Input
          label={t('stakeAmount')}
          type="number"
          min="0.01"
          step="0.01"
          value={formData.stakeAmount}
          onChange={(e) =>
            setFormData({ ...formData, stakeAmount: Number(e.target.value) })
          }
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="accent">
            {t('createProposal')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}