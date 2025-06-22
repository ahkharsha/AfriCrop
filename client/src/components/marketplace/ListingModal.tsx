import React from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { type Crop } from '@/types'

interface ListingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    cropId: bigint
    priceInWei: bigint
    quantityToSell: bigint
    plantsDiedOffPercentage: number
  }) => void
  availableCrops: Crop[]
}

export const ListingModal: React.FC<ListingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableCrops,
}) => {
  const t = useTranslations('Marketplace')
  const [formData, setFormData] = React.useState({
    cropId: BigInt(0),
    priceInWei: BigInt(0),
    quantityToSell: BigInt(0),
    plantsDiedOffPercentage: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      priceInWei: BigInt(formData.priceInWei),
      quantityToSell: BigInt(formData.quantityToSell),
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('newListing')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full p-2 border border-primary-300 rounded-lg"
          value={formData.cropId.toString()}
          onChange={(e) =>
            setFormData({ ...formData, cropId: BigInt(e.target.value) })
          }
          required
        >
          <option value="0">{t('selectCrop')}</option>
          {availableCrops.map((crop) => (
            <option key={crop.id.toString()} value={crop.id.toString()}>
              {t(`cropTypes.${crop.cropType.toLowerCase()}`)} (#{crop.id.toString()})
            </option>
          ))}
        </select>

        <Input
          label={t('price')}
          type="number"
          min="0"
          step="0.0001"
          value={formData.priceInWei.toString()}
          onChange={(e) =>
            setFormData({ ...formData, priceInWei: BigInt(e.target.value) })
          }
          required
        />

        <Input
          label={t('quantity')}
          type="number"
          min="1"
          value={formData.quantityToSell.toString()}
          onChange={(e) =>
            setFormData({ ...formData, quantityToSell: BigInt(e.target.value) })
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