
import { useState, useRef } from "react";
import { getModels, saveModels } from "@/lib/storage";
import { Model } from "@/types/model";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { download, upload } from "lucide-react";

const DataManager = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  
  const handleExportModels = () => {
    const models = getModels();
    const dataStr = JSON.stringify(models, null, 2);
    
    // Create a blob and create a download link
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `modelhub_export_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: `${models.length} models exported successfully.`
    });
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImportErrors([]);
    
    if (!file) {
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate imported data
        if (!Array.isArray(importedData)) {
          setImportErrors(["Invalid import file: Expected an array of models"]);
          return;
        }
        
        // Simple validation of model structure
        const validationErrors: string[] = [];
        const validModels: Model[] = [];
        
        importedData.forEach((item: any, index: number) => {
          if (typeof item !== "object" || !item.id || !item.name) {
            validationErrors.push(`Model at position ${index + 1} is missing required fields (id, name)`);
            return;
          }
          validModels.push(item as Model);
        });
        
        if (validationErrors.length > 0) {
          setImportErrors(validationErrors);
          return;
        }
        
        // Merge with existing models
        const existingModels = getModels();
        const mergedModels: Model[] = [...existingModels];
        
        validModels.forEach(newModel => {
          const existingIndex = mergedModels.findIndex(model => model.id === newModel.id);
          if (existingIndex !== -1) {
            // Update existing model
            mergedModels[existingIndex] = newModel;
          } else {
            // Add new model
            mergedModels.push(newModel);
          }
        });
        
        // Save merged models
        saveModels(mergedModels);
        
        toast({
          title: "Import Complete",
          description: `${validModels.length} models imported successfully.`
        });
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error importing models:", error);
        setImportErrors(["Invalid JSON format in import file"]);
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-modelhub-background">
      <Header />
      
      <main className="flex-1 p-6 container max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Model Data Management</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Models</CardTitle>
              <CardDescription>
                Download all model data as a JSON file for backup or transfer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleExportModels} 
                className="w-full flex items-center justify-center"
              >
                <download className="mr-2 h-4 w-4" />
                Export All Models
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Import Models</CardTitle>
              <CardDescription>
                Import models from a JSON file to restore or transfer data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleImportClick} 
                className="w-full flex items-center justify-center"
              >
                <upload className="mr-2 h-4 w-4" />
                Import Models
              </Button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              
              {importErrors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 font-medium mb-1">Import Errors:</p>
                  <ul className="list-disc pl-5 text-red-700 text-sm">
                    {importErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
          <h3 className="font-medium mb-1">About Model Data Management</h3>
          <p className="text-sm">
            Models data is stored in your browser's local storage. Use the export feature to back up your data regularly.
            The import feature will merge imported models with existing ones, updating any models with matching IDs.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DataManager;
