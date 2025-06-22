// types.ts
export enum CropType {
  MAIZE = "MAIZE",
  RICE = "RICE",
  WHEAT = "WHEAT",
  CASSAVA = "CASSAVA",
  BEANS = "BEANS",
  SORGHUM = "SORGHUM",
  MILLET = "MILLET",
  YAM = "YAM",
  POTATOES = "POTATOES",
  COFFEE = "COFFEE",
  COTTON = "COTTON"
}

export enum CropStage {
  SOWN = "SOWN",
  GROWING = "GROWING",
  HARVESTED = "HARVESTED",
  SELLING = "SELLING",
  SOLD = "SOLD",
  CANCELLED = "CANCELLED"
}

export enum ProposalType {
  AdminChange = "AdminChange",
  FundAllocation = "FundAllocation",
  ParameterChange = "ParameterChange",
  ResearchGrant = "ResearchGrant"
}

export enum ProposalStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  PASSED = "PASSED",
  FAILED = "FAILED",
  EXECUTED = "EXECUTED"
}

export interface Farmer {
  walletAddress: `0x${string}`
  reputationPoints: bigint
  sustainabilityScore: bigint
  knowledgePoints: bigint
  harvestPoints: bigint
  lastProposalStakeTime: bigint
  isRegistered: boolean
}

export interface Crop {
  id: bigint
  farmerAddress: `0x${string}`
  cropType: CropType
  farmId: string
  sownTimestamp: bigint
  harvestedTimestamp: bigint
  stage: CropStage
  initialSeeds: bigint
  harvestedOutput: bigint
}

export interface MarketListing {
  listingId: bigint
  cropId: bigint
  seller: `0x${string}`
  priceInWei: bigint
  quantityToSell: bigint
  listingTimestamp: bigint
  isActive: boolean
  cropType?: CropType // Optional frontend-only field
}

export interface Proposal {
  id: bigint
  proposer: `0x${string}`
  proposalType: ProposalType
  description: string
  stakeAmount: bigint
  startBlock: bigint
  endBlock: bigint
  yesVotes: bigint
  noVotes: bigint
  executed: boolean
  status: ProposalStatus
  targetAddress?: `0x${string}`
  amount?: bigint
  paramKey?: bigint
  paramValue?: bigint
  researchGrantDetailsIPFSHash?: string
  title?: string // Frontend-only optional field
}

export interface Lesson {
  id: bigint
  ipfsHash: string
  knowledgePointsReward: bigint
  title?: string // Frontend-only
  description?: string // Frontend-only
}

export interface MentorshipSession {
  id: bigint
  mentor: `0x${string}`
  mentee: `0x${string}`
  accepted: boolean
  completed: boolean
  startTimestamp: bigint
  endTimestamp: bigint
}