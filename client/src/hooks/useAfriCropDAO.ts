import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { useChainCheck } from './useChainCheck'
import { Address } from 'viem'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useAfriCropDAO = () => {
  const { isCorrectChain } = useChainCheck()

  const registerFarmer = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'registerFarmer',
    enabled: isCorrectChain,
  })

  const sowCrop = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'sowCrop',
    enabled: isCorrectChain,
  })

  const updateCropStage = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'updateCropStage',
    enabled: isCorrectChain,
  })

  const listCropForSale = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'listCropForSale',
    enabled: isCorrectChain,
  })

  const purchaseCrop = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'purchaseCrop',
    enabled: isCorrectChain,
  })

  const createProposal = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'createProposal',
    enabled: isCorrectChain,
  })

  const voteOnProposal = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'voteOnProposal',
    enabled: isCorrectChain,
  })

  const completeLesson = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'completeLesson',
    enabled: isCorrectChain,
  })

  const requestMentorship = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'requestMentorship',
    enabled: isCorrectChain,
  })

  const completeMentorship = useContractWrite({
    address: contractAddress,
    abi: AfriCropDAOABI,
    functionName: 'completeMentorship',
    enabled: isCorrectChain,
  })

  return {
    registerFarmer,
    sowCrop,
    updateCropStage,
    listCropForSale,
    purchaseCrop,
    createProposal,
    voteOnProposal,
    completeLesson,
    requestMentorship,
    completeMentorship,
  }
}