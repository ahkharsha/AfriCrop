import { useTranslations } from 'next-intl'
import { ProposalCard } from '@/components/governance/ProposalCard'
import { Button } from '@/components/ui/Button'
import { useGovernance } from '@/hooks/useGovernance'
import { useChainCheck } from '@/hooks/useChainCheck'

export default function GovernancePage() {
  const t = useTranslations('Governance')
  const { isConnected, isCorrectChain } = useChainCheck()
  const { proposals, isLoading, error } = useGovernance()

  if (!isConnected || !isCorrectChain) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <h2 className="text-xl font-semibold mb-4">{t('connectWallet')}</h2>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <p className="text-red-500">{t('errorLoading')}</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-700">{t('title')}</h1>
        <Button variant="accent">{t('newProposal')}</Button>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  )
}