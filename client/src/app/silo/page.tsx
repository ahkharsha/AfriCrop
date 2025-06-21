import { useTranslations } from 'next-intl'
import { Table } from '@/components/ui/Table'
import { useCrops } from '@/hooks/useCrops'
import { useChainCheck } from '@/hooks/useChainCheck'
import { CROP_STAGES } from '@/lib/constants'

export default function SiloPage() {
  const t = useTranslations('Silo')
  const { isConnected, isCorrectChain } = useChainCheck()
  const { crops, isLoading } = useCrops()

  const columns = [
    { key: 'cropType', header: t('cropType') },
    { key: 'farmId', header: t('farmId') },
    { key: 'stage', header: t('stage') },
    { key: 'harvestedOutput', header: t('quantity') },
    { key: 'actions', header: '' },
  ]

  const data = crops.map(crop => ({
    ...crop,
    cropType: t(`cropTypes.${crop.cropType.toLowerCase()}`),
    stage: t(`stages.${crop.stage.toLowerCase()}`),
    actions: crop.stage === 'HARVESTED' ? (
      <button className="text-accent-500 hover:text-accent-600">
        {t('list')}
      </button>
    ) : null
  }))

  if (!isConnected || !isCorrectChain) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">{t('connectWallet')}</h2>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary-700">{t('title')}</h1>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          {CROP_STAGES.map(stage => (
            <button 
              key={stage}
              className="px-4 py-2 rounded-lg bg-primary-100 text-primary-700 font-medium"
            >
              {t(`stages.${stage.toLowerCase()}`)}
            </button>
          ))}
        </div>
        
        <Table columns={columns} data={data} />
      </div>
    </div>
  )
}