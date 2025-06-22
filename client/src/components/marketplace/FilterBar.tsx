import React from 'react'
import { useTranslations } from 'next-intl'
import { CROP_TYPES } from '@/lib/constants'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'

interface FilterBarProps {
  onFilterChange: (filters: {
    cropType: string
    minPrice: number
    maxPrice: number
  }) => void
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const t = useTranslations('Marketplace')
  const [filters, setFilters] = React.useState({
    cropType: '',
    minPrice: 0,
    maxPrice: 0,
  })

  React.useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Select
        options={[
          { value: '', label: t('allCrops') },
          ...CROP_TYPES.map((type) => ({
            value: type,
            label: t(`cropTypes.${type.toLowerCase()}`),
          })),
        ]}
        value={filters.cropType}
        onChange={(e) =>
          setFilters({ ...filters, cropType: e.target.value })
        }
        className="min-w-[200px]"
        placeholder={t('allCrops')}
      />

      <div className="flex gap-4">
        <Input
          placeholder={t('minPrice')}
          type="number"
          min="0"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: Number(e.target.value) })
          }
          className="w-24"
        />
        <Input
          placeholder={t('maxPrice')}
          type="number"
          min="0"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-24"
        />
      </div>
    </div>
  )
}