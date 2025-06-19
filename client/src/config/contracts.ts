// client/src/config/contracts.ts
export const CONTRACT_ADDRESSES = {
  sepolia: {
    dao: '0x...', // Replace with deployed address
    token: '0x...', // Replace with deployed address
    nft: '0x...', // Replace with deployed address
  },
  // Commented out for future ApeChain integration
  /*
  33111: {
    dao: '0x...',
    token: '0x...',
    nft: '0x...',
  },
  */
};

export const CONTRACT_ABIS = {
  dao: require('../contracts/artifacts/AfriCropDAO.json').abi,
  token: require('../contracts/artifacts/AfriCropToken.json').abi,
  nft: require('../contracts/artifacts/AfriCropNFT.json').abi,
};