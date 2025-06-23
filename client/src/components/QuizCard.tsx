// src/components/QuizCard.tsx (1)
'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

export default function QuizCard({
  question,
  options,
  correctAnswer,
  onComplete
}: {
  question: string
  options: string[]
  correctAnswer: number
  onComplete: (correct: boolean) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const handleAnswer = (index: number) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    onComplete(index === correctAnswer)
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
      <h3 className="font-semibold text-secondary-800 mb-3">{question}</h3>
      
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={answered}
            className={`w-full text-left p-3 rounded-lg transition-all border ${
              answered
                ? index === correctAnswer
                  ? 'bg-green-50 border-green-300'
                  : selected === index
                    ? 'bg-red-50 border-red-300'
                    : 'border-secondary-200'
                : selected === index
                  ? 'bg-primary-50 border-primary-300'
                  : 'border-secondary-200 hover:border-primary-300'
            }`}
          >
            <div className="flex items-center">
              {answered && (
                <span className="mr-2">
                  {index === correctAnswer ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : selected === index ? (
                    <X className="w-4 h-4 text-red-500" />
                  ) : null}
                </span>
              )}
              {option}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}