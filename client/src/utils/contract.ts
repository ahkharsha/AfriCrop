// src/utils/contract.ts
import { createConfig, http } from 'wagmi'
import { curtis } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    // alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'AfriCropDAO',
    chains: [curtis],
    transports: {
      [curtis.id]: http(),
    },
  })
)

export const contractAddress = '0xF859e215A276EC632Fb46DCca4EbccF99C8993D2' // Replace with actual address
export const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__AlreadyRegistered",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "name": "AfriCropDAO__AlreadyVoted",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__CannotVoteOnExpiredProposal",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        }
      ],
      "name": "AfriCropDAO__CropNotFound",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "farmer",
          "type": "address"
        }
      ],
      "name": "AfriCropDAO__FarmerNotRegistered",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__InsufficientFunds",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__InsufficientReputationForMentorship",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__InsufficientStake",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        },
        {
          "internalType": "enum AfriCropDAO.CropStage",
          "name": "expectedStage",
          "type": "uint8"
        }
      ],
      "name": "AfriCropDAO__InvalidCropStage",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__InvalidDonationAmount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__LessonAlreadyCompleted",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "AfriCropDAO__ListingNotFound",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__MentorAlreadyAssigned",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__MentorshipNotCompleted",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "caller",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        }
      ],
      "name": "AfriCropDAO__NotCropOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        }
      ],
      "name": "AfriCropDAO__NotHarvested",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "AfriCropDAO__NotListingOwner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__NotMentorOrMentee",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        }
      ],
      "name": "AfriCropDAO__NotSelling",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__ProposalNotExecutable",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "name": "AfriCropDAO__ProposalNotFound",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requiredStake",
          "type": "uint256"
        }
      ],
      "name": "AfriCropDAO__StakeRequired",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__VotingPeriodNotActive",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AfriCropDAO__ZeroAmount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "CropListed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        }
      ],
      "name": "CropListingCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "daoFee",
          "type": "uint256"
        }
      ],
      "name": "CropPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "farmerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum AfriCropDAO.CropType",
          "name": "cropType",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "farmId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "CropSown",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum AfriCropDAO.CropStage",
          "name": "newStage",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "CropStageUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "action",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data",
          "type": "uint256"
        }
      ],
      "name": "DebugAction",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        }
      ],
      "name": "DebugModeToggled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "farmerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "initialReputation",
          "type": "uint256"
        }
      ],
      "name": "FarmerRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundAllocationExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "farmerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newPoints",
          "type": "uint256"
        }
      ],
      "name": "HarvestPointsUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "farmerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newPoints",
          "type": "uint256"
        }
      ],
      "name": "KnowledgePointsUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "lessonId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "knowledgePointsReward",
          "type": "uint256"
        }
      ],
      "name": "LessonAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "farmerAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "lessonId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "knowledgePointsEarned",
          "type": "uint256"
        }
      ],
      "name": "LessonCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        }
      ],
      "name": "MentorshipAccepted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "mentor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "mentee",
          "type": "address"
        }
      ],
      "name": "MentorshipCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "sessionId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "mentee",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "mentor",
          "type": "address"
        }
      ],
      "name": "MentorshipRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "paramKey",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newValue",
          "type": "uint256"
        }
      ],
      "name": "ParameterChangeExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "proposer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum AfriCropDAO.ProposalType",
          "name": "proposalType",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "stake",
          "type": "uint256"
        }
      ],
      "name": "ProposalCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        }
      ],
      "name": "ProposalExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "farmerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newReputation",
          "type": "uint256"
        }
      ],
      "name": "ReputationUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "farmerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newScore",
          "type": "uint256"
        }
      ],
      "name": "SustainabilityScoreUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "donor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TreasuryDonation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TreasuryWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "votingPower",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "vote",
          "type": "bool"
        }
      ],
      "name": "VoteCast",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DAO_FEE_PERCENT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_sessionId",
          "type": "uint256"
        }
      ],
      "name": "acceptMentorship",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "activeListings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "activeMentorships",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_knowledgePointsReward",
          "type": "uint256"
        }
      ],
      "name": "addLesson",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_farmerAddress",
          "type": "address"
        }
      ],
      "name": "calculateVotingPower",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_listingId",
          "type": "uint256"
        }
      ],
      "name": "cancelCropListing",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_lessonId",
          "type": "uint256"
        }
      ],
      "name": "completeLesson",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_sessionId",
          "type": "uint256"
        }
      ],
      "name": "completeMentorship",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "completedLessons",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum AfriCropDAO.ProposalType",
          "name": "_proposalType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_targetAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_paramKey",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_paramValue",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_researchGrantDetailsIPFSHash",
          "type": "string"
        }
      ],
      "name": "createProposal",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "crops",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "farmerAddress",
          "type": "address"
        },
        {
          "internalType": "enum AfriCropDAO.CropType",
          "name": "cropType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "farmId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "sownTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "harvestedTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "enum AfriCropDAO.CropStage",
          "name": "stage",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "initialSeeds",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "harvestedOutput",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "debugMode",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_points",
          "type": "uint256"
        }
      ],
      "name": "debug_AddReputation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_lessonId",
          "type": "uint256"
        }
      ],
      "name": "debug_CompleteLesson",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cropId",
          "type": "uint256"
        }
      ],
      "name": "debug_ForceHarvest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "donateToTreasury",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        }
      ],
      "name": "executeProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "farmerCrops",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "farmers",
      "outputs": [
        {
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "reputationPoints",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "sustainabilityScore",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "knowledgePoints",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "harvestPoints",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lastProposalStakeTime",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isRegistered",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getActiveMarketListings",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "listingId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "cropId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "priceInWei",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "quantityToSell",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "listingTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "internalType": "struct AfriCropDAO.MarketListing[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllFarmers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCropTypes",
      "outputs": [
        {
          "internalType": "string[11]",
          "name": "",
          "type": "string[11]"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_farmerAddress",
          "type": "address"
        }
      ],
      "name": "getFarmerCrops",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_farmerAddress",
          "type": "address"
        }
      ],
      "name": "getFarmerProfile",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "walletAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "reputationPoints",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "sustainabilityScore",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "knowledgePoints",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "harvestPoints",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastProposalStakeTime",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isRegistered",
              "type": "bool"
            }
          ],
          "internalType": "struct AfriCropDAO.Farmer",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_lessonId",
          "type": "uint256"
        }
      ],
      "name": "getLesson",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "knowledgePointsReward",
              "type": "uint256"
            }
          ],
          "internalType": "struct AfriCropDAO.Lesson",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_farmerAddress",
          "type": "address"
        }
      ],
      "name": "getMentorshipSessions",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        }
      ],
      "name": "getProposalStatus",
      "outputs": [
        {
          "internalType": "enum AfriCropDAO.ProposalStatus",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProposalTypes",
      "outputs": [
        {
          "internalType": "string[4]",
          "name": "",
          "type": "string[4]"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRegisteredFarmers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSustainabilityScores",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "limit",
          "type": "uint256"
        }
      ],
      "name": "getTopCrops",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "farmerAddress",
              "type": "address"
            },
            {
              "internalType": "enum AfriCropDAO.CropType",
              "name": "cropType",
              "type": "uint8"
            },
            {
              "internalType": "string",
              "name": "farmId",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "sownTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "harvestedTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "enum AfriCropDAO.CropStage",
              "name": "stage",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "initialSeeds",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "harvestedOutput",
              "type": "uint256"
            }
          ],
          "internalType": "struct AfriCropDAO.Crop[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTreasuryBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "lessons",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "knowledgePointsReward",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cropId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_priceInWei",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_quantityToSell",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_plantsDiedOffPercentage",
          "type": "uint256"
        }
      ],
      "name": "listCropForSale",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "marketListings",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "cropId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "priceInWei",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantityToSell",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "listingTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "mentorshipSessions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "mentor",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "mentee",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "accepted",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "completed",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "startTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTimestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "proposals",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "proposer",
          "type": "address"
        },
        {
          "internalType": "enum AfriCropDAO.ProposalType",
          "name": "proposalType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "stakeAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startBlock",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endBlock",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "yesVotes",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "noVotes",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "executed",
          "type": "bool"
        },
        {
          "internalType": "enum AfriCropDAO.ProposalStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "targetAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "paramKey",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "paramValue",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "researchGrantDetailsIPFSHash",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_listingId",
          "type": "uint256"
        }
      ],
      "name": "purchaseCrop",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "registerFarmer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "registeredFarmers",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_mentorAddress",
          "type": "address"
        }
      ],
      "name": "requestMentorship",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum AfriCropDAO.CropType",
          "name": "_cropType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "_farmId",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_initialSeeds",
          "type": "uint256"
        }
      ],
      "name": "sowCrop",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_status",
          "type": "bool"
        }
      ],
      "name": "toggleDebugMode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_cropId",
          "type": "uint256"
        },
        {
          "internalType": "enum AfriCropDAO.CropStage",
          "name": "_newStage",
          "type": "uint8"
        }
      ],
      "name": "updateCropStage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_proposalId",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_vote",
          "type": "bool"
        }
      ],
      "name": "voteOnProposal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawDAOFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] // Paste the ABI from your contract