import { CropStage, CropType, ProposalType, ProposalStatus } from '@/lib/contracts/enums'

export type Farmer = {
  walletAddress: string
  reputationPoints: number
  sustainabilityScore: number
  knowledgePoints: number
  harvestPoints: number
  lastProposalStakeTime: number
  isRegistered: boolean
}

export type Crop = {
  id: number
  farmerAddress: string
  cropType: CropType
  farmId: string
  sownTimestamp: number
  harvestedTimestamp: number
  stage: CropStage
  initialSeeds: number
  harvestedOutput: number
}

// export type Crop = {
//   id: bigint
//   farmerAddress: `0x${string}`
//   cropType: bigint
//   farmId: string
//   sownTimestamp: bigint
//   harvestedTimestamp: bigint
//   stage: bigint
//   initialSeeds: bigint
//   harvestedOutput: bigint
// }

// export type MarketListing = {
//   listingId: number
//   cropId: number
//   seller: string
//   priceInWei: bigint
//   quantityToSell: number
//   listingTimestamp: number
//   isActive: boolean
// }

export type MarketListing = {
  listingId: bigint
  cropId: bigint
  seller: `0x${string}`
  priceInWei: bigint
  quantityToSell: bigint
  listingTimestamp: bigint
  isActive: boolean
}

export type Proposal = {
  id: number
  proposer: string
  proposalType: ProposalType
  description: string
  stakeAmount: bigint
  startBlock: number
  endBlock: number
  yesVotes: bigint
  noVotes: bigint
  executed: boolean
  status: ProposalStatus
  targetAddress: string
  amount: bigint
  paramKey: number
  paramValue: number
  researchGrantDetailsIPFSHash: string
}

// export type Lesson = {
//   id: number
//   ipfsHash: string
//   knowledgePointsReward: number
// }

export type Lesson = {
  id: bigint
  ipfsHash: string
  knowledgePointsReward: bigint
}

export type MentorshipSession = {
  id: number
  mentor: string
  mentee: string
  accepted: boolean
  completed: boolean
  startTimestamp: number
  endTimestamp: number
}