export const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString()
}

export const formatEth = (wei: bigint) => {
  return Number(wei) / 1e18
}

export const formatNumber = (num: number, decimals = 2) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const calculateVotingPower = (
  reputation: number,
  sustainability: number,
  knowledge: number
) => {
  const reputationSqrt = Math.sqrt(reputation)
  const sustainabilityBonus = sustainability / 100
  const knowledgeBonus = knowledge / 50
  return Math.floor(
    (reputationSqrt * (100 + sustainabilityBonus + knowledgeBonus)) / 100
  )
}