export const CROP_TYPES = [
  'MAIZE',
  'RICE',
  'WHEAT',
  'CASSAVA',
  'BEANS',
  'SORGHUM',
  'MILLET',
  'YAM',
  'POTATOES',
  'COFFEE',
  'COTTON',
] as const

export const PROPOSAL_TYPES = [
  'AdminChange',
  'FundAllocation',
  'ParameterChange',
  'ResearchGrant',
] as const

export const CROP_STAGES = [
  'SOWN',
  'GROWING',
  'HARVESTED',
  'SELLING',
  'SOLD',
  'CANCELLED',
] as const

export const LEAGUES = [
  { name: 'Bronze', min: 0, max: 199, color: 'bg-amber-600' },
  { name: 'Silver', min: 200, max: 399, color: 'bg-gray-300' },
  { name: 'Gold', min: 400, max: 599, color: 'bg-yellow-400' },
  { name: 'Platinum', min: 600, max: 799, color: 'bg-teal-300' },
  { name: 'Master', min: 800, max: 1000, color: 'bg-purple-500' },
]