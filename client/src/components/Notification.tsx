// src/components/Notification.tsx (1)
'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

export default function Notification({ 
  message, 
  type, 
  onClose,
  autoClose = 5000 
}: {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
  autoClose?: number
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false)
        onClose()
      }, autoClose)

      return () => clearTimeout(timer)
    }
  }, [onClose, autoClose])

  if (!visible) return null

  const icon = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }[type]

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }[type]

  return (
    <div className={`fixed bottom-4 right-4 border rounded-lg p-4 shadow-lg ${bgColor} animate-fade-in`}>
      <div className="flex items-start space-x-3">
        {icon}
        <div className="flex-1">
          <p className="font-medium text-secondary-800">{message}</p>
        </div>
        <button 
          onClick={() => {
            setVisible(false)
            onClose()
          }}
          className="text-secondary-400 hover:text-secondary-600"
        >
          &times;
        </button>
      </div>
    </div>
  )
}