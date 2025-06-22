// utils.ts
export const formatEth = (wei: bigint): string => {
  return (Number(wei) / 1e18).toFixed(4)
}

export const formatDate = (timestamp: bigint): string => {
  return new Date(Number(timestamp) * 1000).toLocaleDateString()
}

export const formatNumber = (num: bigint, decimals = 2): string => {
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

export const truncateAddress = (address: `0x${string}`): string => {
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