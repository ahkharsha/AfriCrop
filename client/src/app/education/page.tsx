// app/education/page.tsx
import { useTranslations } from 'next-intl'
import { LessonCard } from '@/components/education/LessonCard'
import { MentorshipCard } from '@/components/education/MentorshipCard'
import { Tabs } from '@/components/ui/Tabs'
import { useEducation } from '@/hooks/useEducation'
import { useChainCheck } from '@/hooks/useChainCheck'
import { useAccount } from 'wagmi'

export default function EducationPage() {
  const t = useTranslations('Education')
  const { isConnected, isCorrectChain } = useChainCheck()
  const { address } = useAccount()
  const { lessons, mentorships, isLoading } = useEducation()

  const tabs = [
    { id: 'lessons', label: t('lessons') },
    { id: 'mentorships', label: t('mentorships') },
  ]

  if (!isConnected || !isCorrectChain) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">{t('connectWallet')}</h2>
      </div>
    )
  }

  // Get completed lesson IDs (frontend-only logic)
  const completedLessonIds = new Set<string>()
  // You would need to implement this based on your contract's getCompletedLessons function

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary-700">{t('title')}</h1>
      
      <Tabs tabs={tabs}>
        {(activeTab) => (
          <div className="mt-6">
            {activeTab === 'lessons' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson) => (
                  <LessonCard 
                    key={lesson.id.toString()} 
                    lesson={lesson}
                    completed={completedLessonIds.has(lesson.id.toString())}
                  />
                ))}
              </div>
            )}
            
            {activeTab === 'mentorships' && (
              <div className="space-y-4">
                {mentorships.map((mentorship) => (
                  <MentorshipCard 
                    key={mentorship.id.toString()} 
                    mentorship={mentorship}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Tabs>
    </div>
  )
}