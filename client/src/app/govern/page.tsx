// src/app/govern/page.tsx
'use client'

import { useReadContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// Define the Proposal type matching your Solidity struct
type Proposal = {
  id: bigint;
  proposer: string;
  proposalType: bigint;
  description: string;
  stakeAmount: bigint;
  startBlock: bigint;
  endBlock: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  executed: boolean;
  status: bigint;
  targetAddress: string;
  amount: bigint;
  paramKey: bigint;
  paramValue: bigint;
  researchGrantDetailsIPFSHash: string;
};

export default function GovernPage() {
  const t = useTranslations()
  
  const { data: proposals } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getAllProposals',
  }) as { data: Proposal[] | undefined }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('governance')}</h1>
          <button className="btn btn-primary">
            {t('createProposal')}
          </button>
        </div>
        
        <div className="space-y-4">
          {proposals?.map((proposal) => (
            <ProposalCard key={proposal.id.toString()} proposal={proposal} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const t = useTranslations()
  
  // Helper to convert enum values to strings
  const getProposalType = (type: bigint) => {
    switch(Number(type)) {
      case 0: return 'admin change';
      case 1: return 'fund allocation';
      case 2: return 'parameter change';
      case 3: return 'research grant';
      default: return 'unknown';
    }
  }

  const getStatus = (status: bigint) => {
    switch(Number(status)) {
      case 0: return 'pending';
      case 1: return 'active';
      case 2: return 'passed';
      case 3: return 'failed';
      case 4: return 'executed';
      default: return 'unknown';
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold text-lg mb-2">{proposal.description}</h3>
      <div className="flex justify-between text-sm text-secondary-600 mb-4">
        <span>{t('type')}: {t(getProposalType(proposal.proposalType))}</span>
        <span>{t('status')}: {t(getStatus(proposal.status))}</span>
      </div>
      <div className="flex space-x-4">
        <button className="btn btn-outline flex-1">
          {t('viewDetails')}
        </button>
        <button className="btn btn-primary flex-1">
          {t('vote')}
        </button>
      </div>
    </div>
  )
}