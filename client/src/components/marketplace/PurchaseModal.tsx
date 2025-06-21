import React from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { formatEth } from '@/lib/utils'

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  listing: {
    priceInWei: bigint
    quantity: number
    cropType: string
  }
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  listing,
}) => {
  const t = useTranslations('Marketplace')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('confirmPurchase')}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-secondary-500">{t('cropType')}</p>
            <p className="font-medium">
              {t(`cropTypes.${listing.cropType.toLowerCase()}`)}
            </p>
          </div>
          <div>
            <p className="text-secondary-500">{t('quantity')}</p>
            <p className="font-medium">{listing.quantity}</p>
          </div>
          <div>
            <p className="text-secondary-500">{t('price')}</p>
            <p className="font-medium">{formatEth(listing.priceInWei)} ETH</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button variant="accent" onClick={onConfirm}>
            {t('confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}