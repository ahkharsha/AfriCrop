// src/components/StatsCard.tsx (1)
'use client'

import { ReactNode } from 'react'

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  className = ''
}: {
  title: string
  value: string | number
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-yellow-500'
  }

  const trendIcons = {
    up: '↑',
    down: '↓', 
    neutral: '→'
  }

  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border border-secondary-100 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-secondary-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-primary-700">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${
          trend === 'up' ? 'bg-green-50 text-green-600' : 
          trend === 'down' ? 'bg-red-50 text-red-600' : 
          'bg-yellow-50 text-yellow-600'
        }`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`flex items-center mt-3 text-sm ${trendColors[trend]}`}>
          <span className="font-medium">{trendIcons[trend]}</span>
          <span className="ml-1">From last period</span>
        </div>
      )}
    </div>
  )
}