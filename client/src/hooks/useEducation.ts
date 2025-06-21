import { useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { type Lesson } from '@/types'

export function useEducation() {
  const { data: lessonCount, isLoading: isLoadingCount } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: '_lessonIds',
  })

  const lessonQueries = Array.from({ length: Number(lessonCount || 0) }, (_, i) => 
    useReadContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'lessons',
      args: [BigInt(i + 1)],
      query: {
        enabled: !!lessonCount,
      },
    })
  )

  const isLoading = isLoadingCount || lessonQueries.some(q => q.isLoading)
  const lessons = lessonQueries.map((q, i) => ({
    ...(q.data || {}),
    id: i + 1,
  })).filter(Boolean) as Lesson[]

  return {
    lessons,
    isLoading,
  }
}