import React from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '../ui/Card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ImpactChartProps {
  data: {
    month: string
    carbon: number
    water: number
    biodiversity: number
  }[]
}

export const ImpactChart: React.FC<ImpactChartProps> = ({ data }) => {
  const t = useTranslations('Climate')

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-700 mb-4">
          {t('monthlyImpact')}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="carbon" fill="#3A5A40" name={t('carbon')} />
              <Bar dataKey="water" fill="#4B8DF8" name={t('water')} />
              <Bar dataKey="biodiversity" fill="#8DB38B" name={t('biodiversity')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}