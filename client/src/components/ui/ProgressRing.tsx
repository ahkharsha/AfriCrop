import React from 'react'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
  className?: string
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 8,
  color = 'var(--color-primary-500)',
  trackColor = 'var(--color-primary-100)',
  className,
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          className="text-primary-100"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary-500"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-lg font-bold text-primary-700">
        {Math.round(progress)}%
      </span>
    </div>
  )
}

export default ProgressRing