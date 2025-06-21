import React from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { formatEth } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

interface ListingCardProps {
  listing: {
    listingId: number
    cropId: number
    seller: string
    priceInWei: bigint
    quantityToSell: number
    cropType: string
  }
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const t = useTranslations('Marketplace')

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-primary-700">
            {t(`cropTypes.${listing.cropType.toLowerCase()}`)}
          </h3>
          <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded">
            #{listing.listingId}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-secondary-500">{t('quantity')}</p>
            <p className="font-medium">{listing.quantityToSell}</p>
          </div>
          <div>
            <p className="text-secondary-500">{t('price')}</p>
            <p className="font-medium">{formatEth(listing.priceInWei)} ETH</p>
          </div>
          <div>
            <p className="text-secondary-500">{t('seller')}</p>
            <p className="font-medium truncate">{listing.seller}</p>
          </div>
        </div>

        <Button variant="accent" className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t('purchase')}
        </Button>
      </div>
    </Card>
  )
}