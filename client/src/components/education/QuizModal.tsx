import React from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (correct: number) => void
  questions: {
    question: string
    options: string[]
    correctAnswer: number
  }[]
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  questions,
}) => {
  const t = useTranslations('Education')
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
  const [score, setScore] = React.useState(0)

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      onComplete(score)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('quiz')} size="lg">
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-primary-700">
          {questions[currentQuestion].question}
        </h3>
        
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              className={`w-full text-left p-3 rounded-lg border ${
                selectedOption === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-primary-200 hover:border-primary-300'
              }`}
              onClick={() => setSelectedOption(index)}
            >
              {option}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary-500">
            {t('question')} {currentQuestion + 1} / {questions.length}
          </span>
          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
          >
            {currentQuestion < questions.length - 1 ? t('next') : t('complete')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}