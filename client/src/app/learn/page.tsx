// src/app/learn/page.tsx
'use client'

import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import QuizCard from '@/components/QuizCard'
import { BookOpen, Trophy, Users } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

type Lesson = {
  id: bigint
  title: string
  content: string
  question1: string
  option1A: string
  option1B: string
  option1C: string
  question2: string
  option2A: string
  option2B: string
  option2C: string
  question3: string
  option3A: string
  option3B: string
  option3C: string
  knowledgePointsReward: bigint
}

export default function LearnPage() {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const t = useTranslations()
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const { data: lessons } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getAllLessons',
  }) as { data: Lesson[] | undefined }

  const { data: completedLessons } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'completedLessons',
    args: [address!, BigInt(0)] // Just checking if any lesson is completed
  }) as { data: boolean | undefined }

  const completeLesson = () => {
    if (!activeLesson) return

    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'completeLesson',
      args: [activeLesson.id],
    }, {
      onSuccess: () => {
        toast.success(`Lesson completed! +${activeLesson.knowledgePointsReward.toString()} points`)
        setActiveLesson(null)
        setQuizCompleted(false)
      },
      onError: (error) => {
        toast.error(`Failed to complete lesson: ${error.message}`)
      }
    })
  }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Education Center</h1>
              <p className="text-secondary-600 mt-2">
                Learn sustainable farming practices and earn knowledge points
              </p>
            </div>
          </div>

          {activeLesson ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card title={activeLesson.title}>
                  <div className="prose max-w-none">
                    <p>{activeLesson.content}</p>
                  </div>
                </Card>

                <div className="mt-6 space-y-6">
                  <QuizCard
                    question={activeLesson.question1}
                    options={[
                      activeLesson.option1A,
                      activeLesson.option1B,
                      activeLesson.option1C
                    ]}
                    correctAnswer={0}
                    onComplete={() => {}}
                  />
                  <QuizCard
                    question={activeLesson.question2}
                    options={[
                      activeLesson.option2A,
                      activeLesson.option2B,
                      activeLesson.option2C
                    ]}
                    correctAnswer={0}
                    onComplete={() => {}}
                  />
                  <QuizCard
                    question={activeLesson.question3}
                    options={[
                      activeLesson.option3A,
                      activeLesson.option3B,
                      activeLesson.option3C
                    ]}
                    correctAnswer={0}
                    onComplete={(correct) => {
                      if (correct) setQuizCompleted(true)
                    }}
                  />
                </div>
              </div>

              <div>
                <Card title="Lesson Progress">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Reward</h4>
                      <p className="text-primary-600 font-medium">
                        {activeLesson.knowledgePointsReward.toString()} Knowledge Points
                      </p>
                    </div>

                    <button
                      onClick={completeLesson}
                      disabled={!quizCompleted}
                      className={`btn w-full ${
                        quizCompleted ? 'btn-primary' : 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
                      }`}
                    >
                      Complete Lesson
                    </button>

                    <button
                      onClick={() => {
                        setActiveLesson(null)
                        setQuizCompleted(false)
                      }}
                      className="btn btn-outline w-full"
                    >
                      Back to Lessons
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons?.map((lesson) => (
                <Card key={lesson.id.toString()} className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-primary-100 rounded-lg mr-4">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                      </div>
                      <h3 className="font-semibold text-lg">{lesson.title}</h3>
                    </div>
                    
                    <p className="text-secondary-600 mb-4 line-clamp-2">
                      {lesson.content.substring(0, 100)}...
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-500">
                        {lesson.knowledgePointsReward.toString()} points
                      </span>
                      <button
                        onClick={() => setActiveLesson(lesson)}
                        className="btn btn-primary px-4 py-2 text-sm"
                      >
                        Start Lesson
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}