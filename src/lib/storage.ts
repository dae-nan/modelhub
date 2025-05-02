
import { Model, AuditLogEntry, DataLineage } from "@/types/model";
import { v4 as uuidv4 } from "uuid";

// LocalStorage keys
const MODELS_STORAGE_KEY = "modelhub_models";
const AUDIT_LOGS_STORAGE_KEY = "modelhub_audit_logs";
const INITIALIZED_KEY = "modelhub_initialized";

// Sample data for initial load
const createSampleData = (): { models: Model[], auditLogs: AuditLogEntry[] } => {
  const now = new Date();
  const sampleModels: Model[] = [
    // Tier 1 models (high risk)
    {
      id: "t1-credit-001",
      name: "Credit Scoring Model",
      businessUnit: "Consumer Banking",
      owner: "Jane Smith",
      description: "Machine learning model that calculates credit scores based on customer financial history and behavior patterns. Used for all consumer credit applications.",
      domain: "Risk",
      status: "Approved",
      tier: 1,
      gitRepoLink: "https://github.com/financecorp/credit-scoring",
      lastUpdated: new Date().toISOString(),
      reviewDate: new Date(now.getFullYear(), 4, 28).toISOString(), // May 28
      materialityScores: {
        complexity: 4,
        exposure: 5,
        criticality: 5
      },
      documentation: {
        assumptions: "Assumes customer financial data is accurate and complete. Assumes credit bureau data is up to date.",
        limitations: "Limited effectiveness for customers with limited credit history.",
        validationSummary: "Validated against 5 years of historical data with 95% accuracy.",
        monitoringPlan: "Monthly population stability review. Quarterly performance report."
      },
      dataLineage: {
        upstream: ["Core Banking System", "Credit Bureau API", "Fraud Detection System"],
        downstream: ["Loan Origination System", "Customer Dashboard"]
      }
    },
    {
      id: "t1-fraud-002",
      name: "Transaction Fraud Detection",
      businessUnit: "Security",
      owner: "Michael Chen",
      description: "Real-time fraud detection system using neural networks to identify suspicious transactions across all payment channels.",
      domain: "Risk",
      status: "Draft",
      tier: 1,
      gitRepoLink: "https://github.com/financecorp/fraud-detection",
      lastUpdated: new Date().toISOString(),
      reviewDate: new Date(now.getFullYear(), 5, 15).toISOString(), // June 15
      materialityScores: {
        complexity: 5,
        exposure: 5,
        criticality: 5
      },
      documentation: {
        assumptions: "Assumes pattern of fraudulent activities remains relatively consistent.",
        limitations: "May flag unusual but legitimate transactions for high-net-worth clients.",
        validationSummary: "99.2% true positive rate with 0.5% false positive rate in sandbox testing.",
        monitoringPlan: "Daily performance review. Weekly false positive analysis."
      },
      dataLineage: {
        upstream: ["Payment Processing System", "Customer Database", "Merchant Registry"],
        downstream: ["Alert Management System", "Security Operations Dashboard"]
      }
    },
    
    // Tier 2 models (medium risk)
    {
      id: "t2-customer-003",
      name: "Customer Churn Predictor",
      businessUnit: "Marketing",
      owner: "Sarah Johnson",
      description: "Predictive model that identifies customers likely to leave in the next 90 days based on account activity and service interactions.",
      domain: "Customer Analytics",
      status: "Approved",
      tier: 2,
      gitRepoLink: "https://github.com/financecorp/churn-predictor",
      lastUpdated: new Date().toISOString(),
      reviewDate: new Date(now.getFullYear(), 6, 7).toISOString(), // July 7
      materialityScores: {
        complexity: 3,
        exposure: 3,
        criticality: 4
      },
      documentation: {
        assumptions: "Assumes past customer behavior patterns predict future attrition.",
        limitations: "Less accurate for new customers with limited history.",
        validationSummary: "Model achieved 82% accuracy in backtest with 3 years of historical data.",
        monitoringPlan: "Quarterly review of prediction accuracy."
      },
      dataLineage: {
        upstream: ["Customer Relationship Management", "Transaction Records", "Call Center Logs"],
        downstream: ["Retention Campaign System", "Executive Dashboard"]
      }
    },
    {
      id: "t2-segment-004",
      name: "Market Segmentation Cluster",
      businessUnit: "Marketing",
      owner: "David Park",
      description: "Clustering model that groups customers into market segments for targeted campaign strategies.",
      domain: "Customer Analytics",
      status: "Retired",
      tier: 2,
      lastUpdated: new Date().toISOString(),
      reviewDate: new Date(now.getFullYear(), 7, 22).toISOString(), // August 22
      materialityScores: {
        complexity: 3,
        exposure: 2,
        criticality: 3
      },
      documentation: {
        assumptions: "Assumes customer preferences within segments are relatively homogeneous.",
        limitations: "Segments need periodic recalibration as market conditions change.",
        validationSummary: "Silhouette score of 0.72 indicates good cluster separation.",
        monitoringPlan: "Semi-annual review of cluster validity."
      },
      dataLineage: {
        upstream: ["Customer Database", "Transaction History", "Digital Behavior Tracking"],
        downstream: ["Campaign Management System", "Product Recommendation Engine"]
      }
    },
    
    // Tier 3 models (low risk)
    {
      id: "t3-ops-005",
      name: "Branch Traffic Forecaster",
      businessUnit: "Operations",
      owner: "Robert Lee",
      description: "Time series model that forecasts customer traffic at branch locations to optimize staffing levels.",
      domain: "Operations",
      status: "Approved",
      tier: 3,
      lastUpdated: new Date().toISOString(),
      reviewDate: new Date(now.getFullYear(), 8, 10).toISOString(), // September 10
      materialityScores: {
        complexity: 2,
        exposure: 1,
        criticality: 2,
        overridden: true,
        justification: "Model only used for planning purposes, no direct customer impact."
      },
      documentation: {
        assumptions: "Assumes past traffic patterns reflect future needs with seasonal adjustments.",
        limitations: "Does not account for unexpected events or marketing campaigns.",
        validationSummary: "MAPE of 12% for 30-day forecasts across all branches.",
        monitoringPlan: "Monthly review of forecast accuracy."
      },
      dataLineage: {
        upstream: ["Branch Transaction Logs", "Calendar API", "Historical Traffic Records"],
        downstream: ["Workforce Management System", "Branch Operations Dashboard"]
      }
    },
    {
      id: "t3-report-006",
      name: "Regulatory Report Generator",
      businessUnit: "Compliance",
      owner: "Lisa Wong",
      description: "Template-based model that generates standardized regulatory reports from financial data.",
      domain: "Compliance",
      status: "Draft",
      tier: 3,
      lastUpdated: new Date().toISOString(),
      reviewDate: new Date(now.getFullYear(), 9, 5).toISOString(), // October 5
      materialityScores: {
        complexity: 1,
        exposure: 2,
        criticality: 3
      },
      documentation: {
        assumptions: "Assumes input data is validated and complete.",
        limitations: "Limited flexibility for regulatory changes requiring extensive reprogramming.",
        validationSummary: "100% compliance with current regulatory format requirements.",
        monitoringPlan: "Review triggered by regulatory reporting requirement changes."
      },
      dataLineage: {
        upstream: ["Financial Data Warehouse", "Transaction Records", "Compliance Database"],
        downstream: ["Regulatory Submission System", "Compliance Dashboard"]
      }
    },
    {
      id: "t2-wealth-007",
      name: "Investment Portfolio Optimizer",
      businessUnit: "Wealth Management",
      owner: "Thomas Grant",
      description: "Optimization model that recommends portfolio allocations based on client risk profile and market conditions.",
      domain: "Investment",
      status: "Approved",
      tier: 2,
      lastUpdated: new Date().toISOString(),
      reviewDate: new Date(now.getFullYear(), 10, 12).toISOString(), // November 12
      materialityScores: {
        complexity: 4,
        exposure: 3,
        criticality: 4
      },
      documentation: {
        assumptions: "Assumes historical asset correlations are predictive of future relationships.",
        limitations: "Cannot predict black swan events or market crashes.",
        validationSummary: "Backtested across multiple market cycles with favorable risk-adjusted returns.",
        monitoringPlan: "Weekly performance review. Monthly risk model updates."
      },
      dataLineage: {
        upstream: ["Market Data Feed", "Client Risk Profiles", "Asset Performance Database"],
        downstream: ["Financial Advisor Dashboard", "Client Reporting System"]
      }
    },
    {
      id: "t3-atm-008",
      name: "ATM Cash Replenishment",
      businessUnit: "Operations",
      owner: "Gloria Martinez",
      description: "Time series model that forecasts cash needs for ATM network to minimize refill trips while avoiding outages.",
      domain: "Operations",
      status: "Approved",
      tier: 3,
      lastUpdated: new Date().toISOString(),
      reviewDate: new Date(now.getFullYear(), 11, 8).toISOString(), // December 8
      materialityScores: {
        complexity: 2,
        exposure: 1,
        criticality: 2
      },
      documentation: {
        assumptions: "Assumes withdrawal patterns follow historical seasonal patterns.",
        limitations: "Limited accuracy during holidays or special events.",
        validationSummary: "Reduced cash outages by 75% while optimizing replenishment efficiency.",
        monitoringPlan: "Monthly review of forecast accuracy and cash outage incidents."
      },
      dataLineage: {
        upstream: ["ATM Transaction Logs", "Cash Management System", "Calendar API"],
        downstream: ["Cash Logistics System", "Operations Dashboard"]
      }
    }
  ];
  
  const sampleLogs: AuditLogEntry[] = [];
  
  // Create sample audit logs for each model
  sampleModels.forEach(model => {
    const createDate = new Date(now);
    createDate.setMonth(now.getMonth() - 2);
    
    // Model creation log
    sampleLogs.push({
      id: uuidv4(),
      modelId: model.id,
      modelName: model.name,
      timestamp: createDate.toISOString(),
      action: "create",
      modifiedBy: model.owner
    });
    
    // Model update logs
    if (model.status === "Approved") {
      const approvalDate = new Date(createDate);
      approvalDate.setDate(approvalDate.getDate() + 14);
      
      sampleLogs.push({
        id: uuidv4(),
        modelId: model.id,
        modelName: model.name,
        timestamp: approvalDate.toISOString(),
        action: "update",
        field: "status",
        oldValue: JSON.stringify("Draft"),
        newValue: JSON.stringify("Approved"),
        modifiedBy: "Model Governance Committee"
      });
    }
    
    if (model.status === "Retired") {
      const retiredDate = new Date(createDate);
      retiredDate.setDate(retiredDate.getDate() + 90);
      
      sampleLogs.push({
        id: uuidv4(),
        modelId: model.id,
        modelName: model.name,
        timestamp: retiredDate.toISOString(),
        action: "update",
        field: "status",
        oldValue: JSON.stringify("Approved"),
        newValue: JSON.stringify("Retired"),
        modifiedBy: "Maria Rodriguez"
      });
    }
    
    // Documentation update
    if (model.documentation) {
      const docUpdateDate = new Date(createDate);
      docUpdateDate.setDate(docUpdateDate.getDate() + 7);
      
      sampleLogs.push({
        id: uuidv4(),
        modelId: model.id,
        modelName: model.name,
        timestamp: docUpdateDate.toISOString(),
        action: "update",
        field: "documentation",
        oldValue: JSON.stringify({
          assumptions: "Initial assumptions",
          limitations: "Initial limitations"
        }),
        newValue: JSON.stringify(model.documentation),
        modifiedBy: model.owner
      });
    }
    
    // Score update for some models
    if (model.tier < 3) {
      const scoreUpdateDate = new Date(createDate);
      scoreUpdateDate.setDate(scoreUpdateDate.getDate() + 21);
      
      const oldScores = {
        complexity: Math.max(1, model.materialityScores?.complexity || 3 - 1),
        exposure: Math.max(1, model.materialityScores?.exposure || 3 - 1),
        criticality: Math.max(1, model.materialityScores?.criticality || 3 - 1)
      };
      
      sampleLogs.push({
        id: uuidv4(),
        modelId: model.id,
        modelName: model.name,
        timestamp: scoreUpdateDate.toISOString(),
        action: "update",
        field: "materialityScores",
        oldValue: JSON.stringify(oldScores),
        newValue: JSON.stringify(model.materialityScores),
        modifiedBy: "Risk Assessment Team"
      });
    }
  });
  
  return { models: sampleModels, auditLogs: sampleLogs };
};

// Initialize storage with sample data if empty
const initializeStorage = (): void => {
  const isInitialized = localStorage.getItem(INITIALIZED_KEY);
  
  if (!isInitialized) {
    const { models, auditLogs } = createSampleData();
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(models));
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(auditLogs));
    localStorage.setItem(INITIALIZED_KEY, "true");
    
    console.log("Sample data initialized with", models.length, "models and", auditLogs.length, "audit logs");
  }
};

// Initialize storage on module load
initializeStorage();

// Get models from localStorage
export const getModels = (): Model[] => {
  try {
    const models = localStorage.getItem(MODELS_STORAGE_KEY);
    return models ? JSON.parse(models) : [];
  } catch (error) {
    console.error("Failed to get models from localStorage:", error);
    return [];
  }
};

// Save models to localStorage
export const saveModels = (models: Model[]): void => {
  try {
    localStorage.setItem(MODELS_STORAGE_KEY, JSON.stringify(models));
  } catch (error) {
    console.error("Failed to save models to localStorage:", error);
  }
};

// Get a single model by ID
export const getModelById = (id: string): Model | undefined => {
  const models = getModels();
  return models.find((model) => model.id === id);
};

// Add or update a model
export const saveModel = (model: Model, username = "System User"): void => {
  const models = getModels();
  const now = new Date().toISOString();
  const existingModelIndex = models.findIndex((m) => m.id === model.id);
  
  if (existingModelIndex !== -1) {
    const existingModel = models[existingModelIndex];
    const updatedModel = { ...model, lastUpdated: now };
    
    // Create audit log entries for changes
    createAuditLogsForChanges(existingModel, updatedModel, username);
    
    models[existingModelIndex] = updatedModel;
  } else {
    // Creating a new model
    const newModel = {
      ...model,
      lastUpdated: now,
      reviewDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    };
    
    // Add audit log for model creation
    addAuditLog({
      id: uuidv4(),
      modelId: newModel.id,
      modelName: newModel.name,
      timestamp: now,
      action: "create",
      modifiedBy: username,
    });
    
    models.push(newModel);
  }
  
  saveModels(models);
};

// Delete a model by ID
export const deleteModel = (id: string, username = "System User"): void => {
  const models = getModels();
  const modelToDelete = models.find(model => model.id === id);
  
  if (modelToDelete) {
    // Add audit log for model deletion
    addAuditLog({
      id: uuidv4(),
      modelId: modelToDelete.id,
      modelName: modelToDelete.name,
      timestamp: new Date().toISOString(),
      action: "delete",
      modifiedBy: username,
    });
  }
  
  const updatedModels = models.filter((model) => model.id !== id);
  saveModels(updatedModels);
};

// Helper function to create audit logs for changes
const createAuditLogsForChanges = (oldModel: Model, newModel: Model, username: string): void => {
  const now = new Date().toISOString();
  const ignoredFields = ["lastUpdated"]; // Fields to ignore for audit logs
  
  // Compare all fields in oldModel with newModel
  Object.keys(newModel).forEach((key) => {
    if (ignoredFields.includes(key)) return;
    
    const oldValue = JSON.stringify(oldModel[key as keyof Model]);
    const newValue = JSON.stringify(newModel[key as keyof Model]);
    
    // Only create a log if values are different
    if (oldValue !== newValue) {
      addAuditLog({
        id: uuidv4(),
        modelId: newModel.id,
        modelName: newModel.name,
        timestamp: now,
        action: "update",
        field: key,
        oldValue,
        newValue,
        modifiedBy: username,
      });
    }
  });
};

// Get audit logs from localStorage
export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    const logs = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Failed to get audit logs from localStorage:", error);
    return [];
  }
};

// Get audit logs for a specific model
export const getAuditLogsForModel = (modelId: string): AuditLogEntry[] => {
  const logs = getAuditLogs();
  return logs.filter((log) => log.modelId === modelId);
};

// Add a new audit log entry
export const addAuditLog = (log: AuditLogEntry): void => {
  const logs = getAuditLogs();
  logs.push(log);
  
  try {
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Failed to save audit log to localStorage:", error);
  }
};

// Reset the initialized flag (for testing)
export const resetInitializedFlag = (): void => {
  localStorage.removeItem(INITIALIZED_KEY);
};
