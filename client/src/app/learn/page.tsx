// src/app/learn/page.tsx
'use client'

import { useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// Define the Lesson type matching your Solidity struct
type Lesson = {
  id: bigint;
  ipfsHash: string;
  knowledgePointsReward: bigint;
};

export default function LearnPage() {
  const t = useTranslations()
  
  const { data: lessons } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getAllLessons',
  }) as { data: Lesson[] | undefined }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <h1 className="text-2xl font-bold mb-6">{t('education')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {lessons?.map((lesson) => (
            <LessonCard 
              key={lesson.id.toString()} 
              lesson={lesson} 
              t={t}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold mb-6">{t('mentorship')}</h2>
        <div className="bg-white p-6 rounded-xl shadow">
          <button className="btn btn-primary">
            {t('findMentor')}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function LessonCard({ lesson, t }: { lesson: Lesson, t: any }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">
        {t('lesson')} #{lesson.id.toString()}
      </h3>
      <p className="text-secondary-600 mb-4">
        {t('points')}: {lesson.knowledgePointsReward.toString()}
      </p>
      <button className="btn btn-outline w-full">
        {t('startLesson')}
      </button>
    </div>
  )
}