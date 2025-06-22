// src/app/dao/page.tsx
'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { useState } from 'react'
import toast from 'react-hot-toast'

type ProposalView = {
  id: bigint
  proposer: string
  title: string
  proposalType: bigint
  description: string
  stakeAmount: bigint
  yesVotes: bigint
  noVotes: bigint
  executed: boolean
  status: bigint
  targetAddress: string
  amount: bigint
}

export default function DaoPage() {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const t = useTranslations()
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    type: 0,
    targetAddress: '',
    amount: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: proposals } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getActiveProposals',
  }) as { data: ProposalView[] | undefined }

  const { data: treasuryBalance } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getTreasuryBalance',
  }) as { data: bigint | undefined }

  const { data: votingPower } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'calculateVotingPower',
    args: [address!],
  }) as { data: bigint | undefined }

  const createProposal = () => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'createProposal',
      args: [
        newProposal.title,
        newProposal.type,
        newProposal.description,
        newProposal.targetAddress,
        BigInt(newProposal.amount || '0')
      ],
      value: BigInt('10000000000000000'), // 0.01 ETH
    }, {
      onSuccess: () => {
        toast.success('Proposal created successfully!')
        setShowCreateModal(false)
        setNewProposal({
          title: '',
          description: '',
          type: 0,
          targetAddress: '',
          amount: ''
        })
      },
      onError: (error) => {
        toast.error(`Failed to create proposal: ${error.message}`)
      }
    })
  }

  const voteOnProposal = (proposalId: number, vote: boolean) => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'voteOnProposal',
      args: [proposalId, vote],
    }, {
      onSuccess: () => {
        toast.success(`Voted ${vote ? 'Yes' : 'No'} on proposal!`)
      },
      onError: (error) => {
        toast.error(`Failed to vote: ${error.message}`)
      }
    })
  }

  const executeProposal = (proposalId: number) => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'executeProposal',
      args: [proposalId],
    }, {
      onSuccess: () => {
        toast.success('Proposal executed!')
      },
      onError: (error) => {
        toast.error(`Failed to execute proposal: ${error.message}`)
      }
    })
  }

  const getProposalType = (type: bigint) => {
    switch(Number(type)) {
      case 0: return 'Admin Change'
      case 1: return 'Fund Allocation'
      default: return 'Unknown'
    }
  }

  const getStatus = (status: bigint) => {
    switch(Number(status)) {
      case 0: return 'Pending'
      case 1: return 'Active'
      case 2: return 'Passed'
      case 3: return 'Failed'
      case 4: return 'Executed'
      default: return 'Unknown'
    }
  }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">DAO Governance</h1>
            <p className="text-secondary-600">
              Treasury Balance: {treasuryBalance ? Number(treasuryBalance) / 1e18 : '0'} ETH
            </p>
            <p className="text-secondary-600">
              Your Voting Power: {votingPower?.toString() || '0'}
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create Proposal
          </button>
        </div>
        
        <div className="space-y-4">
          {proposals?.map((proposal) => (
            <div key={proposal.id.toString()} className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{proposal.title}</h3>
                  <p className="text-secondary-600">{proposal.description}</p>
                </div>
                <div className="text-sm text-right">
                  <p>Type: {getProposalType(proposal.proposalType)}</p>
                  <p>Status: {getStatus(proposal.status)}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="w-full bg-secondary-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full" 
                    style={{
                      width: `${(Number(proposal.yesVotes) + Number(proposal.noVotes)) > 0 
                        ? (Number(proposal.yesVotes) / (Number(proposal.yesVotes) + Number(proposal.noVotes)) * 100) 
                        : 0}%`
                    }}
                  ></div>
                </div>
                <div className="ml-4 text-sm">
                  {proposal.yesVotes.toString()} Yes / {proposal.noVotes.toString()} No
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => voteOnProposal(Number(proposal.id), true)}
                  className="btn btn-outline flex-1"
                >
                  Vote Yes
                </button>
                <button 
                  onClick={() => voteOnProposal(Number(proposal.id), false)}
                  className="btn btn-outline flex-1"
                >
                  Vote No
                </button>
                <button 
                  onClick={() => executeProposal(Number(proposal.id))}
                  disabled={proposal.status !== BigInt(2) || proposal.executed}
                  className={`btn flex-1 ${
                    proposal.status === BigInt(2) && !proposal.executed 
                      ? 'btn-primary' 
                      : 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
                  }`}
                >
                  Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Proposal</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                  className="input-field"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newProposal.type}
                  onChange={(e) => setNewProposal({...newProposal, type: Number(e.target.value)})}
                  className="input-field"
                >
                  <option value={0}>Admin Change</option>
                  <option value={1}>Fund Allocation</option>
                </select>
              </div>
              
              {newProposal.type === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Address</label>
                    <input
                      type="text"
                      value={newProposal.targetAddress}
                      onChange={(e) => setNewProposal({...newProposal, targetAddress: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (ETH)</label>
                    <input
                      type="number"
                      value={newProposal.amount}
                      onChange={(e) => setNewProposal({...newProposal, amount: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  onClick={createProposal}
                  disabled={!newProposal.title || !newProposal.description}
                  className="btn btn-primary"
                >
                  Create (Stake 0.01 ETH)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}