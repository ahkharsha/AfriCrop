import { useAccount, useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { type Farmer } from '@/types'

export function useAfriCropDAO(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount()
  const farmerAddress = address || connectedAddress

  const { data: farmerData, isLoading } = useReadContract({
    abi: AfriCropDAOABI,
    address: AFRICROP_DAO_ADDRESS,
    functionName: 'getFarmerProfile',
    args: [farmerAddress],
    query: {
      enabled: !!farmerAddress,
    },
  })

  return {
    farmerData: farmerData as Farmer | undefined,
    isLoading,
  }
}