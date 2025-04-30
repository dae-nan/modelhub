
import { Model, AuditLogEntry } from "@/types/model";
import { v4 as uuidv4 } from "uuid";

// LocalStorage keys
const MODELS_STORAGE_KEY = "modelhub_models";
const AUDIT_LOGS_STORAGE_KEY = "modelhub_audit_logs";

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
