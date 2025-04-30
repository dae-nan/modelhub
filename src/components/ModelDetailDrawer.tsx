
import { Model } from "@/types/model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ExternalLink } from "lucide-react";
import AuditLogViewer from "./AuditLogViewer";
import GovernanceDocumentation from "./GovernanceDocumentation";

interface ModelDetailDrawerProps {
  model: Model | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModelDetailDrawer = ({ model, isOpen, onClose }: ModelDetailDrawerProps) => {
  if (!model) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-red-100 text-red-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Retired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold">{model.name}</DrawerTitle>
            <DrawerDescription className="flex flex-wrap gap-2 items-center">
              <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
              <Badge className={getTierColor(model.tier)}>Tier {model.tier}</Badge>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Last updated: {formatDate(model.lastUpdated)}
              </span>
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="audit">Audit Log</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">General Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Business Unit:</span>
                        <p>{model.businessUnit}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Owner:</span>
                        <p>{model.owner}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Domain:</span>
                        <p>{model.domain}</p>
                      </div>
                      {model.gitRepoLink && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Git Repository:</span>
                          <p>
                            <a 
                              href={model.gitRepoLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              {model.gitRepoLink}
                              <ExternalLink className="h-3.5 w-3.5 ml-1" />
                            </a>
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-500">Next Review Date:</span>
                        <p>{model.reviewDate ? formatDate(model.reviewDate) : "Not scheduled"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Model Description</h3>
                    <p className="text-gray-700">{model.description || "No description provided."}</p>
                    
                    {model.materialityScores && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Materiality Scores</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Complexity:</span>
                            <span>{model.materialityScores.complexity} / 5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Exposure:</span>
                            <span>{model.materialityScores.exposure} / 5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Criticality:</span>
                            <span>{model.materialityScores.criticality} / 5</span>
                          </div>
                          {model.materialityScores.overridden && (
                            <div className="mt-2">
                              <span className="text-sm font-medium text-gray-500">Override Justification:</span>
                              <p className="text-gray-700 italic">"{model.materialityScores.justification}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documentation">
                {model.documentation ? (
                  <GovernanceDocumentation 
                    initialDocumentation={model.documentation}
                    readOnly={true}
                  />
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No documentation available for this model.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="audit">
                <AuditLogViewer modelId={model.id} />
              </TabsContent>
            </Tabs>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ModelDetailDrawer;
