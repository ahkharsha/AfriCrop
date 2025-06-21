import React from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

interface ListingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    cropId: number
    priceInWei: number
    quantityToSell: number
    plantsDiedOffPercentage: number
  }) => void
  availableCrops: { id: number; cropType: string }[]
}

export const ListingModal: React.FC<ListingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableCrops,
}) => {
  const t = useTranslations('Marketplace')
  const [formData, setFormData] = React.useState({
    cropId: 0,
    priceInWei: 0,
    quantityToSell: 0,
    plantsDiedOffPercentage: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('newListing')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full p-2 border border-primary-300 rounded-lg"
          value={formData.cropId}
          onChange={(e) =>
            setFormData({ ...formData, cropId: Number(e.target.value) })
          }
          required
        >
          <option value="">{t('selectCrop')}</option>
          {availableCrops.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {t(`cropTypes.${crop.cropType.toLowerCase()}`)} (#{crop.id})
            </option>
          ))}
        </select>

        <Input
          label={t('price')}
          type="number"
          min="0"
          step="0.0001"
          value={formData.priceInWei}
          onChange={(e) =>
            setFormData({ ...formData, priceInWei: Number(e.target.value) })
          }
          required
        />

        <Input
          label={t('quantity')}
          type="number"
          min="1"
          value={formData.quantityToSell}
          onChange={(e) =>
            setFormData({ ...formData, quantityToSell: Number(e.target.value) })
          }
          required
        />

        <Input
          label={t('plantsDiedOff')}
          type="number"
          min="0"
          max="100"
          value={formData.plantsDiedOffPercentage}
          onChange={(e) =>
            setFormData({
              ...formData,
              plantsDiedOffPercentage: Number(e.target.value),
            })
          }
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="accent">
            {t('createListing')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}