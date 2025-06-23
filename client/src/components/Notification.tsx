// src/components/Notification.tsx (1)
'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info } from 'lucide-react'

export default function Notification({ message, type, onClose }: {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  const bgColor = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  }[type]

  const icon = {
    success: <CheckCircle className="w-5 h-5 mr-2" />,
    error: <XCircle className="w-5 h-5 mr-2" />,
    info: <Info className="w-5 h-5 mr-2" />
  }[type]

  return (
    <div className={`fixed bottom-4 right-4 border-l-4 p-4 rounded-lg shadow-lg ${bgColor} flex items-center animate-fade-in`}>
      {icon}
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button 
        onClick={() => {
          setVisible(false)
          onClose()
        }}
        className="ml-4 text-lg"
      >
        &times;
      </button>
    </div>
  )
}