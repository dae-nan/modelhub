
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Model, ModelStatus, ModelTier, MaterialityScores, GovernanceDocumentation } from "@/types/model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import MaterialityCalculator from "./MaterialityCalculator";
import GovernanceDocumentationSection from "./GovernanceDocumentation";

interface ModelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (model: Model) => void;
  modelToEdit?: Model;
}

const modelFormSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  businessUnit: z.string().min(1, "Business unit is required"),
  owner: z.string().min(1, "Owner is required"),
  description: z.string().min(1, "Description is required"),
  domain: z.string().min(1, "Domain is required"),
  status: z.enum(["Draft", "Approved", "Retired"]),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  gitRepoLink: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type ModelFormValues = z.infer<typeof modelFormSchema>;

const ModelFormModal = ({ isOpen, onClose, onSave, modelToEdit }: ModelFormModalProps) => {
  const isEditMode = !!modelToEdit;
  const [materialityScores, setMaterialityScores] = useState<MaterialityScores | undefined>(
    modelToEdit?.materialityScores
  );
  const [documentation, setDocumentation] = useState<GovernanceDocumentation | undefined>(
    modelToEdit?.documentation
  );

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: "",
      businessUnit: "",
      owner: "",
      description: "",
      domain: "",
      status: "Draft" as ModelStatus,
      tier: 3 as ModelTier,
      gitRepoLink: "",
    },
  });

  // Update form when modelToEdit changes
  useEffect(() => {
    if (modelToEdit) {
      form.reset({
        name: modelToEdit.name,
        businessUnit: modelToEdit.businessUnit,
        owner: modelToEdit.owner,
        description: modelToEdit.description,
        domain: modelToEdit.domain,
        status: modelToEdit.status,
        tier: modelToEdit.tier,
        gitRepoLink: modelToEdit.gitRepoLink || "",
      });
      setMaterialityScores(modelToEdit.materialityScores);
      setDocumentation(modelToEdit.documentation);
    } else {
      form.reset({
        name: "",
        businessUnit: "",
        owner: "",
        description: "",
        domain: "",
        status: "Draft" as ModelStatus,
        tier: 3 as ModelTier,
        gitRepoLink: "",
      });
      setMaterialityScores(undefined);
      setDocumentation(undefined);
    }
  }, [modelToEdit, form]);

  const handleMaterialityUpdate = (scores: MaterialityScores, calculatedTier: ModelTier) => {
    setMaterialityScores(scores);
    form.setValue("tier", calculatedTier);
  };

  const handleDocumentationUpdate = (docs: GovernanceDocumentation) => {
    setDocumentation(docs);
    toast.success("Documentation updated");
  };

  const onSubmit = (data: ModelFormValues) => {
    try {
      // Create a model object with the required properties
      // Explicitly cast properties to ensure they match the Model interface
      const model: Model = {
        id: modelToEdit?.id || uuidv4(),
        name: data.name,
        businessUnit: data.businessUnit,
        owner: data.owner,
        description: data.description,
        domain: data.domain,
        status: data.status,
        tier: data.tier,
        lastUpdated: new Date().toISOString(),
        gitRepoLink: data.gitRepoLink || undefined,
        materialityScores: materialityScores,
        documentation: documentation,
      };
      
      onSave(model);
      toast.success(`Model ${isEditMode ? "updated" : "created"} successfully`, {
        description: model.name,
      });
      onClose();
    } catch (error) {
      toast.error("Failed to save model", {
        description: "Please try again",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Model" : "Create New Model"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the model information below."
              : "Fill in the model information below to create a new model."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Unit*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business unit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model owner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter domain" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier*</FormLabel>
                    <div className="flex space-x-2 items-end">
                      <div className="flex-1">
                        <Select
                          onValueChange={(value) => field.onChange(Number(value) as ModelTier)}
                          defaultValue={String(field.value)}
                          value={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Tier 1 (Critical)</SelectItem>
                            <SelectItem value="2">Tier 2 (High Impact)</SelectItem>
                            <SelectItem value="3">Tier 3 (Standard)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <MaterialityCalculator
                        initialValues={materialityScores}
                        onSave={handleMaterialityUpdate}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gitRepoLink"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Git Repository Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/example/repo" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: Link to the model's Git repository
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter model description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 border-t">
              <GovernanceDocumentationSection
                initialValues={documentation}
                onSave={handleDocumentationUpdate}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-modelhub-primary hover:bg-modelhub-primary/90">
                {isEditMode ? "Update Model" : "Create Model"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModelFormModal;
