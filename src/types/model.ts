
export type ModelStatus = "Draft" | "Approved" | "Retired";
export type ModelTier = 1 | 2 | 3;

export interface MaterialityScores {
  complexity: number;
  exposure: number;
  criticality: number;
  overridden?: boolean;
  justification?: string;
}

export interface GovernanceDocumentation {
  assumptions?: string;
  limitations?: string;
  validationSummary?: string;
  monitoringPlan?: string;
}

export interface DataLineage {
  upstream?: string[];
  downstream?: string[];
}

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
  reviewDate?: string;
  materialityScores?: MaterialityScores;
  documentation?: GovernanceDocumentation;
  dataLineage?: DataLineage;
}

export type AuditLogAction = "create" | "update" | "delete";

export interface AuditLogEntry {
  id: string;
  modelId: string;
  modelName: string;
  timestamp: string;
  action: AuditLogAction;
  field?: string;
  oldValue?: string;
  newValue?: string;
  modifiedBy: string;
}
