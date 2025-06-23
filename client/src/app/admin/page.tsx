// src/app/admin/page.tsx
'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Card from '@/components/Card'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  const t = useTranslations()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    question1: '',
    option1A: '',
    option1B: '',
    option1C: '',
    question2: '',
    option2A: '',
    option2B: '',
    option2C: '',
    question3: '',
    option3A: '',
    option3B: '',
    option3C: '',
    knowledgePointsReward: '100'
  })

  const { data: owner } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'owner',
  }) as { data: string }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addLesson = async () => {
    if (!address || address !== owner) {
      toast.error('Only contract owner can add lessons')
      return
    }

    setLoading(true)
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'addLesson',
        args: [
          formData.title,
          formData.content,
          formData.question1,
          formData.option1A,
          formData.option1B,
          formData.option1C,
          formData.question2,
          formData.option2A,
          formData.option2B,
          formData.option2C,
          formData.question3,
          formData.option3A,
          formData.option3B,
          formData.option3C,
          BigInt(formData.knowledgePointsReward)
        ],
      })
      toast.success('Lesson added successfully!')
      router.push('/learn')
    } catch (error: any) {
      toast.error(`Failed to add lesson: ${error.shortMessage || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-lg mb-4">{t('connectWallet')}</p>
      </div>
    )
  }

  if (address !== owner) {
    return (
      <div className="text-center py-12">
        <p className="text-lg mb-4">Only Admin can access this page</p>
      </div>
    )
  }

  return (
    <main className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-secondary-600 mt-2">Add new educational content</p>
          </div>
        </div>

        <Card title="Add New Lesson" className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Lesson Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Sustainable Maize Farming"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lesson Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="input-field min-h-[120px]"
                placeholder="Detailed lesson content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Knowledge Points Reward</label>
              <input
                type="number"
                name="knowledgePointsReward"
                value={formData.knowledgePointsReward}
                onChange={handleChange}
                className="input-field"
                min="1"
              />
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold">Questions</h3>
              
              {/* Question 1 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium mb-1">Question 1</label>
                <input
                  type="text"
                  name="question1"
                  value={formData.question1}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="What is the optimal planting depth for maize?"
                />
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-secondary-500 mb-1">Correct Answer</label>
                    <input
                      type="text"
                      name="option1A"
                      value={formData.option1A}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="2-3 cm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-secondary-500 mb-1">Option B</label>
                    <input
                      type="text"
                      name="option1B"
                      value={formData.option1B}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="5-7 cm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-secondary-500 mb-1">Option C</label>
                    <input
                      type="text"
                      name="option1C"
                      value={formData.option1C}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="10-12 cm"
                    />
                  </div>
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium mb-1">Question 2</label>
                <input
                  type="text"
                  name="question2"
                  value={formData.question2}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Which companion crop benefits maize the most?"
                />
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-secondary-500 mb-1">Correct Answer</label>
                    <input
                      type="text"
                      name="option2A"
                      value={formData.option2A}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="Beans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-secondary-500 mb-1">Option B</label>
                    <input
                      type="text"
                      name="option2B"
                      value={formData.option2B}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="Wheat"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-secondary-500 mb-1">Option C</label>
                    <input
                      type="text"
                      name="option2C"
                      value={formData.option2C}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="Cotton"
                    />
                  </div>
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium mb-1">Question 3</label>
                <input
                  type="text"
                  name="question3"
                  value={formData.question3}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="How often should maize be watered in dry season?"
                />
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-secondary-500 mb-1">Correct Answer</label>
                    <input
                      type="text"
                      name="option3A"
                      value={formData.option3A}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="Every 3-4 days"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-secondary-500 mb-1">Option B</label>
                    <input
                      type="text"
                      name="option3B"
                      value={formData.option3B}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="Daily"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-secondary-500 mb-1">Option C</label>
                    <input
                      type="text"
                      name="option3C"
                      value={formData.option3C}
                      onChange={handleChange}
                      className="input-field text-sm"
                      placeholder="Weekly"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={addLesson}
              disabled={loading || !formData.title || !formData.content}
              className="btn btn-primary w-full mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">🌀</span>
                  Adding Lesson...
                </span>
              ) : 'Add Lesson'}
            </button>
          </div>
        </Card>
      </div>
    </main>
  )
}