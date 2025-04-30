
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ModelInventoryTable from "@/components/ModelInventoryTable";
import ModelFormModal from "@/components/ModelFormModal";
import ModelDetailDrawer from "@/components/ModelDetailDrawer";
import ReviewReminders from "@/components/ReviewReminders";
import AuditLogViewer from "@/components/AuditLogViewer";
import { Model } from "@/types/model";
import { getModels, saveModel, getModelById } from "@/lib/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelToEdit, setModelToEdit] = useState<Model | undefined>(undefined);
  const [selectedModelId, setSelectedModelId] = useState<string | undefined>(undefined);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const { toast } = useToast();

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

    toast({
      title: "Model saved",
      description: `${model.name} has been successfully saved.`
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectModelForReview = (modelId: string) => {
    const model = getModelById(modelId);
    if (model) {
      handleEdit(model);
    }
  };

  const handleViewDetails = (model: Model) => {
    setSelectedModel(model);
    setSelectedModelId(model.id);
    setIsDetailDrawerOpen(true);
  };

  const handleCloseDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-modelhub-background">
      <Header />
      
      <main className="flex-1 p-6 container max-w-7xl mx-auto space-y-6">
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="inventory">Model Inventory</TabsTrigger>
            <TabsTrigger value="reviews">Review Reminders</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory">
            <ModelInventoryTable 
              models={models} 
              onEdit={handleEdit} 
              onCreateNew={handleCreateNew}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ReviewReminders 
              models={models} 
              onSelectModel={handleSelectModelForReview} 
            />
          </TabsContent>
          
          <TabsContent value="audit">
            <div className="space-y-4">
              <AuditLogViewer modelId={selectedModelId} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <ModelFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave} 
        modelToEdit={modelToEdit} 
      />

      <ModelDetailDrawer
        model={selectedModel}
        isOpen={isDetailDrawerOpen}
        onClose={handleCloseDetailDrawer}
      />
    </div>
  );
};

export default Index;
