// src/components/QuizCard.tsx
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
    <div className="bg-white p-6 rounded-xl shadow-md border border-secondary-200">
      <h3 className="font-semibold text-lg mb-4">{question}</h3>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={answered}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              answered
                ? index === correctAnswer
                  ? 'bg-green-100 border-green-500'
                  : selected === index
                    ? 'bg-red-100 border-red-500'
                    : 'border-secondary-300'
                : selected === index
                  ? 'bg-primary-100 border-primary-500'
                  : 'border-secondary-300 hover:border-primary-500'
            }`}
          >
            <div className="flex items-center">
              {answered && (
                <span className="mr-2">
                  {index === correctAnswer ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : selected === index ? (
                    <X className="w-5 h-5 text-red-500" />
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