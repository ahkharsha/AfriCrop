import { useWriteContract, useReadContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/abis/AfriCropDAO'
import { useChainCheck } from './useChainCheck'
import { Address } from 'viem'

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address

export const useAfriCropDAO = () => {
  const { isCorrectChain } = useChainCheck()
  const { writeContract: registerFarmer } = useWriteContract()
  const { writeContract: sowCrop } = useWriteContract()
  const { writeContract: updateCropStage } = useWriteContract()
  const { writeContract: listCropForSale } = useWriteContract()
  const { writeContract: purchaseCrop } = useWriteContract()
  const { writeContract: createProposal } = useWriteContract()
  const { writeContract: voteOnProposal } = useWriteContract()
  const { writeContract: completeLesson } = useWriteContract()
  const { writeContract: requestMentorship } = useWriteContract()
  const { writeContract: completeMentorship } = useWriteContract()

  return {
    registerFarmer: (args: { account: Address }) => 
      registerFarmer({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'registerFarmer',
        args: [args.account],
      }),
    sowCrop: (args: { cropType: number, farmId: string, initialSeeds: number }) =>
      sowCrop({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'sowCrop',
        args: [args.cropType, args.farmId, args.initialSeeds],
      }),
    updateCropStage: (args: { cropId: number, newStage: number }) =>
      updateCropStage({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'updateCropStage',
        args: [args.cropId, args.newStage],
      }),
    listCropForSale: (args: { 
      cropId: number, 
      priceInWei: bigint, 
      quantityToSell: number, 
      plantsDiedOffPercentage: number 
    }) =>
      listCropForSale({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'listCropForSale',
        args: [args.cropId, args.priceInWei, args.quantityToSell, args.plantsDiedOffPercentage],
        value: args.priceInWei,
      }),
    purchaseCrop: (args: { listingId: number, value: bigint }) =>
      purchaseCrop({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'purchaseCrop',
        args: [args.listingId],
        value: args.value,
      }),
    createProposal: (args: {
      proposalType: number,
      description: string,
      stakeAmount: bigint
    }) =>
      createProposal({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'createProposal',
        args: [args.proposalType, args.description],
        value: args.stakeAmount,
      }),
    voteOnProposal: (args: { proposalId: number, vote: boolean }) =>
      voteOnProposal({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'voteOnProposal',
        args: [args.proposalId, args.vote],
      }),
    completeLesson: (args: { lessonId: number }) =>
      completeLesson({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'completeLesson',
        args: [args.lessonId],
      }),
    requestMentorship: (args: { mentorAddress: Address }) =>
      requestMentorship({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'requestMentorship',
        args: [args.mentorAddress],
      }),
    completeMentorship: (args: { sessionId: number }) =>
      completeMentorship({
        address: contractAddress,
        abi: AfriCropDAOABI,
        functionName: 'completeMentorship',
        args: [args.sessionId],
      }),
  }
}