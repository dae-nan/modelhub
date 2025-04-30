
import { Model } from "@/types/model";

// LocalStorage keys
const MODELS_STORAGE_KEY = "modelhub_models";

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
export const saveModel = (model: Model): void => {
  const models = getModels();
  const existingModelIndex = models.findIndex((m) => m.id === model.id);
  
  if (existingModelIndex !== -1) {
    models[existingModelIndex] = model;
  } else {
    models.push(model);
  }
  
  saveModels(models);
};

// Delete a model by ID
export const deleteModel = (id: string): void => {
  const models = getModels();
  const updatedModels = models.filter((model) => model.id !== id);
  saveModels(updatedModels);
};
