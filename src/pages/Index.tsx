
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ModelInventoryTable from "@/components/ModelInventoryTable";
import ModelFormModal from "@/components/ModelFormModal";
import { Model } from "@/types/model";
import { getModels, saveModel } from "@/lib/storage";

const Index = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelToEdit, setModelToEdit] = useState<Model | undefined>(undefined);

  // Load models from localStorage on component mount
  useEffect(() => {
    const loadedModels = getModels();
    setModels(loadedModels);
  }, []);

  const handleCreateNew = () => {
    setModelToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (model: Model) => {
    setModelToEdit(model);
    setIsModalOpen(true);
  };

  const handleSave = (model: Model) => {
    saveModel(model);
    
    // Update local state
    setModels((prevModels) => {
      const existingModelIndex = prevModels.findIndex((m) => m.id === model.id);
      
      if (existingModelIndex !== -1) {
        const updatedModels = [...prevModels];
        updatedModels[existingModelIndex] = model;
        return updatedModels;
      } else {
        return [...prevModels, model];
      }
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-modelhub-background">
      <Header />
      
      <main className="flex-1 p-6 container max-w-7xl mx-auto">
        <ModelInventoryTable 
          models={models} 
          onEdit={handleEdit} 
          onCreateNew={handleCreateNew} 
        />
      </main>
      
      <ModelFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave} 
        modelToEdit={modelToEdit} 
      />
    </div>
  );
};

export default Index;
