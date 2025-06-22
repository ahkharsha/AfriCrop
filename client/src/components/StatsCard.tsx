// src/components/StatsCard.tsx
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

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-secondary-200 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-secondary-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${
          trend === 'up' ? 'bg-green-100' : 
          trend === 'down' ? 'bg-red-100' : 'bg-yellow-100'
        }`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`flex items-center mt-2 text-sm ${trendColors[trend]}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} 
          <span className="ml-1">Last period</span>
        </div>
      )}
    </div>
  )
}