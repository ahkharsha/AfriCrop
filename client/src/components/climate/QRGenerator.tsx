import React from 'react'
import QRCode from 'react-qr-code'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'

interface QRGeneratorProps {
  farmerId: string
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ farmerId }) => {
  const t = useTranslations('Climate')

  return (
    <Card>
      <div className="p-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          {t('farmerId')}
        </h3>
        <div className="p-4 bg-white rounded-lg">
          <QRCode value={farmerId} size={128} />
        </div>
        <p className="mt-4 text-sm text-secondary-500">
          {t('qrDescription')}
        </p>
      </div>
    </Card>
  )
}