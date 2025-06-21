import { useAccount, useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { type Crop } from '@/types'

export function useCrops(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount()
  const farmerAddress = address || connectedAddress

  const { data: cropIds, isLoading: isLoadingIds } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'getFarmerCrops',
    args: [farmerAddress],
    query: {
      enabled: !!farmerAddress,
    },
  }) as {
    data: bigint[] | undefined
    isLoading: boolean
  }

  const cropQueries = (cropIds || []).map((id) => 
    useReadContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'crops',
      args: [id],
      query: {
        enabled: !!cropIds,
      },
    }) as {
      data: Crop | undefined
      isLoading: boolean
    }
  )

  const isLoading = isLoadingIds || cropQueries.some(q => q.isLoading)
  const crops = cropQueries.map(q => q.data).filter(Boolean) as Crop[]

  return {
    crops,
    isLoading,
  }
}