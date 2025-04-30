
export type ModelStatus = "Draft" | "Approved" | "Retired";
export type ModelTier = 1 | 2 | 3;

export interface Model {
  id: string;
  name: string;
  businessUnit: string;
  owner: string;
  description: string;
  domain: string;
  status: ModelStatus;
  tier: ModelTier;
  gitRepoLink?: string;
  lastUpdated: string;
}
