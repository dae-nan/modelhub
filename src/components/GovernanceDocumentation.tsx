
import { useState } from "react";
import { GovernanceDocumentation as GovernanceDoc } from "@/types/model";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface GovernanceDocumentationProps {
  initialValues?: GovernanceDoc;
  onSave: (documentation: GovernanceDoc) => void;
  readOnly?: boolean;
}

const GovernanceDocumentation = ({ 
  initialValues, 
  onSave,
  readOnly = false
}: GovernanceDocumentationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [documentation, setDocumentation] = useState<GovernanceDoc>(initialValues || {
    assumptions: "",
    limitations: "",
    validationSummary: "",
    monitoringPlan: ""
  });

  const handleChange = (field: keyof GovernanceDoc, value: string) => {
    setDocumentation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(documentation);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border rounded-md"
    >
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-medium">Governance Documentation</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="p-4 pt-0 space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="assumptions">
            <AccordionTrigger>Assumptions</AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={documentation.assumptions || ""}
                onChange={(e) => handleChange("assumptions", e.target.value)}
                placeholder="Document model assumptions here..."
                className="min-h-[120px] mb-2"
                disabled={readOnly}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="limitations">
            <AccordionTrigger>Limitations</AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={documentation.limitations || ""}
                onChange={(e) => handleChange("limitations", e.target.value)}
                placeholder="Document model limitations here..."
                className="min-h-[120px] mb-2"
                disabled={readOnly}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="validationSummary">
            <AccordionTrigger>Validation Summary</AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={documentation.validationSummary || ""}
                onChange={(e) => handleChange("validationSummary", e.target.value)}
                placeholder="Summarize validation process and results..."
                className="min-h-[120px] mb-2"
                disabled={readOnly}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="monitoringPlan">
            <AccordionTrigger>Monitoring Plan</AccordionTrigger>
            <AccordionContent>
              <Textarea
                value={documentation.monitoringPlan || ""}
                onChange={(e) => handleChange("monitoringPlan", e.target.value)}
                placeholder="Document the monitoring plan here..."
                className="min-h-[120px] mb-2"
                disabled={readOnly}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {!readOnly && (
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Documentation</Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default GovernanceDocumentation;
