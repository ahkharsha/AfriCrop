// import { BLOCK_EXPLORER_URL } from './constants';

// export function shortenAddress(address?: string) {
//   if (!address) return ''
//   return `${address.slice(0, 6)}...${address.slice(-4)}`
// }

// export function cn(...inputs: (string | number | boolean | undefined | null)[]) {
//   return inputs
//     .filter(input => typeof input === 'string' || typeof input === 'number')
//     .join(' ')
// }

// export function formatEtherscanLink(
//   type: 'tx' | 'address',
//   hash: string
// ) {
//   return `${BLOCK_EXPLORER_URL}/${type}/${hash}`
// }

import { BLOCK_EXPLORER_URL } from './constants';

export function shortenAddress(address?: string) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatEtherscanLink(
  type: 'tx' | 'address',
  hash: string
) {
  return `${BLOCK_EXPLORER_URL}/${type}/${hash}`
}