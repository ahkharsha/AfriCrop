import { useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { type Proposal } from '@/types'

export function useGovernance() {
  const { data: proposalCount, isLoading: isLoadingCount } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: '_proposalIds',
  })

  const proposalQueries = Array.from({ length: Number(proposalCount || 0) }, (_, i) => 
    useReadContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'proposals',
      args: [BigInt(i + 1)],
      query: {
        enabled: !!proposalCount,
      },
    })
  )

  const isLoading = isLoadingCount || proposalQueries.some(q => q.isLoading)
  const proposals = proposalQueries.map((q, i) => ({
    ...(q.data || {}),
    id: i + 1,
  })).filter(Boolean) as Proposal[]

  return {
    proposals,
    isLoading,
  }
}