import React from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { CROP_TYPES } from '@/lib/constants'

interface CropModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    cropType: string
    farmId: string
    initialSeeds: number
  }) => void
}

export const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const t = useTranslations('Crops')
  const [formData, setFormData] = React.useState({
    cropType: '',
    farmId: '',
    initialSeeds: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('newCrop')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label={t('cropType')}
          options={CROP_TYPES.map((type) => ({
            value: type,
            label: t(`cropTypes.${type.toLowerCase()}`),
          }))}
          value={formData.cropType}
          onChange={(e) =>
            setFormData({ ...formData, cropType: e.target.value })
          }
          required
        />

        <Input
          label={t('farmId')}
          placeholder="Farm-001"
          value={formData.farmId}
          onChange={(e) =>
            setFormData({ ...formData, farmId: e.target.value })
          }
          required
        />

        <Input
          label={t('initialSeeds')}
          type="number"
          min="1"
          value={formData.initialSeeds}
          onChange={(e) =>
            setFormData({ ...formData, initialSeeds: Number(e.target.value) })
          }
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="accent">
            {t('createCrop')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}