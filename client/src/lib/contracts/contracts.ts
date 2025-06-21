// client/src/lib/contracts.ts
import type { Abi } from 'viem'
import AfriCropDAO from '../../abis/AfriCropDAO.json'

// Export the ABI with proper typing
export const AfriCropDAOABI = AfriCropDAO.abi as Abi