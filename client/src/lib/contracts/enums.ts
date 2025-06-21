export enum CropStage {
  SOWN,
  GROWING,
  HARVESTED,
  SELLING,
  SOLD,
  CANCELLED
}

export enum CropType {
  MAIZE,
  RICE,
  WHEAT,
  CASSAVA,
  BEANS,
  SORGHUM,
  MILLET,
  YAM,
  POTATOES,
  COFFEE,
  COTTON
}

export enum ProposalType {
  AdminChange,
  FundAllocation,
  ParameterChange,
  ResearchGrant
}

export enum ProposalStatus {
  PENDING,
  ACTIVE,
  PASSED,
  FAILED,
  EXECUTED
}