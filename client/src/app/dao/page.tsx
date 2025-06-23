// src/app/dao/page.tsx
'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Card from '@/components/Card'
import StatsCard from '@/components/StatsCard'
import { Users, FileText, Vote, Clock } from 'lucide-react'

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
  const { address, isConnected } = useAccount()
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
  const [loading, setLoading] = useState({
    create: false,
    vote: false,
    execute: false
  })

  const { data: proposals, refetch: refetchProposals } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getActiveProposals',
  }) as { data: ProposalView[] | undefined, refetch: () => void }

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

  const { data: registeredFarmers } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getRegisteredFarmers',
  }) as { data: string[] | undefined }

  const createProposal = async () => {
    if (!newProposal.title || !newProposal.description) return
    
    setLoading({...loading, create: true})
    try {
      await writeContract({
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
      })
      toast.success('Proposal created successfully!')
      setShowCreateModal(false)
      setNewProposal({
        title: '',
        description: '',
        type: 0,
        targetAddress: '',
        amount: ''
      })
      refetchProposals()
    } catch (error: any) {
      toast.error(`Failed to create proposal: ${error.shortMessage || error.message}`)
    } finally {
      setLoading({...loading, create: false})
    }
  }

  const voteOnProposal = async (proposalId: number, vote: boolean) => {
    setLoading({...loading, vote: true})
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'voteOnProposal',
        args: [BigInt(proposalId), vote],
      })
      toast.success(`Voted ${vote ? 'Yes' : 'No'} on proposal!`)
      refetchProposals()
    } catch (error: any) {
      toast.error(`Failed to vote: ${error.shortMessage || error.message}`)
    } finally {
      setLoading({...loading, vote: false})
    }
  }

  const executeProposal = async (proposalId: number) => {
    setLoading({...loading, execute: true})
    try {
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'executeProposal',
        args: [BigInt(proposalId)],
      })
      toast.success('Proposal executed successfully!')
      refetchProposals()
    } catch (error: any) {
      toast.error(`Failed to execute proposal: ${error.shortMessage || error.message}`)
    } finally {
      setLoading({...loading, execute: false})
    }
  }

  const getProposalType = (type: bigint) => {
    switch(Number(type)) {
      case 0: return t('adminChange')
      case 1: return t('fundAllocation')
      default: return t('unknown')
    }
  }

  const getStatus = (status: bigint) => {
    switch(Number(status)) {
      case 0: return t('pending')
      case 1: return t('active')
      case 2: return t('passed')
      case 3: return t('failed')
      case 4: return t('executed')
      default: return t('unknown')
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-lg mb-4">{t('connectWallet')}</p>
      </div>
    )
  }

  return (
    <main className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{t('daoGovernance')}</h1>
        <p className="text-secondary-600 mb-8">{t('participateInDAO')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title={t('treasuryBalance')}
            value={treasuryBalance ? `${(Number(treasuryBalance) / 1e18).toFixed(2)} ETH` : '0 ETH'}
            icon={<FileText className="w-5 h-5" />}
          />
          <StatsCard
            title={t('totalMembers')}
            value={registeredFarmers?.length || 0}
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title={t('yourVotingPower')}
            value={votingPower?.toString() || '0'}
            icon={<Vote className="w-5 h-5" />}
          />
          <StatsCard
            title={t('activeProposals')}
            value={proposals?.length || 0}
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('activeProposals')}</h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            {t('createProposal')}
          </button>
        </div>
        
        <div className="space-y-4">
          {proposals?.length ? (
            proposals.map((proposal) => (
              <Card key={proposal.id.toString()}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{proposal.title}</h3>
                      <p className="text-secondary-600 mt-1">{proposal.description}</p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="font-medium">{getProposalType(proposal.proposalType)}</p>
                      <p className={`${
                        proposal.status === BigInt(1) ? 'text-primary-600' :
                        proposal.status === BigInt(2) ? 'text-green-600' :
                        proposal.status === BigInt(3) ? 'text-red-600' : 'text-secondary-600'
                      }`}>
                        {getStatus(proposal.status)}
                      </p>
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
                      {proposal.yesVotes.toString()} {t('yes')} / {proposal.noVotes.toString()} {t('no')}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button 
                      onClick={() => voteOnProposal(Number(proposal.id), true)}
                      disabled={loading.vote}
                      className="btn btn-outline flex-1"
                    >
                      {loading.vote ? 'Processing...' : t('voteYes')}
                    </button>
                    <button 
                      onClick={() => voteOnProposal(Number(proposal.id), false)}
                      disabled={loading.vote}
                      className="btn btn-outline flex-1"
                    >
                      {loading.vote ? 'Processing...' : t('voteNo')}
                    </button>
                    <button 
                      onClick={() => executeProposal(Number(proposal.id))}
                      disabled={proposal.status !== BigInt(2) || proposal.executed || loading.execute}
                      className={`btn flex-1 ${
                        proposal.status === BigInt(2) && !proposal.executed 
                          ? 'btn-primary' 
                          : 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
                      }`}
                    >
                      {loading.execute ? 'Processing...' : t('execute')}
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-secondary-400" />
              <h3 className="text-xl font-semibold mt-4">{t('noActiveProposals')}</h3>
              <p className="text-secondary-600 mt-2">
                {t('noActiveProposalsDesc')}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{t('createProposal')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('title')}</label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                  className="input-field"
                  placeholder={t('proposalTitlePlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('description')}</label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder={t('proposalDescPlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{t('type')}</label>
                <select
                  value={newProposal.type}
                  onChange={(e) => setNewProposal({...newProposal, type: Number(e.target.value)})}
                  className="input-field"
                >
                  <option value={0}>{t('adminChange')}</option>
                  <option value={1}>{t('fundAllocation')}</option>
                </select>
              </div>
              
              {newProposal.type === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('targetAddress')}</label>
                    <input
                      type="text"
                      value={newProposal.targetAddress}
                      onChange={(e) => setNewProposal({...newProposal, targetAddress: e.target.value})}
                      className="input-field"
                      placeholder="0x..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('amountETH')}</label>
                    <input
                      type="number"
                      value={newProposal.amount}
                      onChange={(e) => setNewProposal({...newProposal, amount: e.target.value})}
                      className="input-field"
                      placeholder="0.0"
                      step="0.01"
                    />
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={createProposal}
                  disabled={!newProposal.title || !newProposal.description || loading.create}
                  className="btn btn-primary"
                >
                  {loading.create ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">🌀</span>
                      {t('creating')}
                    </span>
                  ) : (
                    `${t('create')} (0.01 ETH)`
                  )}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </main>
  )
}