import React from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { CROP_TYPES } from '@/lib/constants'

interface CropFormProps {
  onSubmit: (data: {
    cropType: string
    farmId: string
    initialSeeds: number
  }) => void
}

export const CropForm: React.FC<CropFormProps> = ({ onSubmit }) => {
  const t = useTranslations('Crops')
  const [formData, setFormData] = React.useState({
    cropType: '',
    farmId: '',
    initialSeeds: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
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

      <button
        type="submit"
        className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
      >
        {t('createCrop')}
      </button>
    </form>
  )
}