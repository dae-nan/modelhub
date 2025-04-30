
import { useState, useEffect } from "react";
import { MaterialityScores, ModelTier } from "@/types/model";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Calculator } from "lucide-react";

interface MaterialityCalculatorProps {
  initialValues?: MaterialityScores;
  onSave: (scores: MaterialityScores, calculatedTier: ModelTier) => void;
}

const MaterialityCalculator = ({ initialValues, onSave }: MaterialityCalculatorProps) => {
  const [complexity, setComplexity] = useState(initialValues?.complexity || 3);
  const [exposure, setExposure] = useState(initialValues?.exposure || 3);
  const [criticality, setCriticality] = useState(initialValues?.criticality || 3);
  const [overridden, setOverridden] = useState(initialValues?.overridden || false);
  const [manualTier, setManualTier] = useState<ModelTier>(initialValues?.overridden ? 
    (calculateTier(complexity, exposure, criticality) as ModelTier) : 3);
  const [justification, setJustification] = useState(initialValues?.justification || "");
  const [open, setOpen] = useState(false);

  // Calculate tier based on scores
  function calculateTier(complexity: number, exposure: number, criticality: number): ModelTier {
    const totalScore = complexity + exposure + criticality;
    
    if (totalScore >= 12) {
      return 1; // High risk - Tier 1
    } else if (totalScore >= 8) {
      return 2; // Medium risk - Tier 2
    } else {
      return 3; // Low risk - Tier 3
    }
  }

  const calculatedTier = calculateTier(complexity, exposure, criticality);
  const displayTier = overridden ? manualTier : calculatedTier;

  const handleSave = () => {
    const scores: MaterialityScores = {
      complexity,
      exposure,
      criticality,
      overridden,
      justification: overridden ? justification : undefined,
    };

    onSave(scores, displayTier);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calculator className="h-4 w-4" />
          Tier Calculator
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Materiality Scoring</h3>
          <p className="text-sm text-muted-foreground">
            Adjust the sliders to calculate the model's tier based on risk factors.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="complexity">Complexity: {complexity}</Label>
                <span className="text-sm text-muted-foreground">(1-5)</span>
              </div>
              <Slider 
                id="complexity" 
                min={1} 
                max={5} 
                step={1} 
                value={[complexity]} 
                onValueChange={(value) => setComplexity(value[0])} 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="exposure">Exposure: {exposure}</Label>
                <span className="text-sm text-muted-foreground">(1-5)</span>
              </div>
              <Slider 
                id="exposure" 
                min={1} 
                max={5} 
                step={1} 
                value={[exposure]} 
                onValueChange={(value) => setExposure(value[0])} 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="criticality">Criticality: {criticality}</Label>
                <span className="text-sm text-muted-foreground">(1-5)</span>
              </div>
              <Slider 
                id="criticality" 
                min={1} 
                max={5} 
                step={1} 
                value={[criticality]} 
                onValueChange={(value) => setCriticality(value[0])} 
              />
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Calculated Tier: {calculatedTier}</h4>
                  <p className="text-sm text-muted-foreground">
                    {calculatedTier === 1 ? "Critical" : calculatedTier === 2 ? "High Impact" : "Standard"}
                  </p>
                </div>
                <div>
                  <Button
                    variant={overridden ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOverridden(!overridden)}
                  >
                    {overridden ? "Using Manual Tier" : "Override Tier"}
                  </Button>
                </div>
              </div>
            </div>

            {overridden && (
              <div className="space-y-2">
                <Label htmlFor="manualTier">Manual Tier Selection</Label>
                <div className="flex space-x-2">
                  {[1, 2, 3].map((tier) => (
                    <Button
                      key={tier}
                      variant={manualTier === tier ? "default" : "outline"}
                      size="sm"
                      onClick={() => setManualTier(tier as ModelTier)}
                    >
                      Tier {tier}
                    </Button>
                  ))}
                </div>
                <Label htmlFor="justification">Justification for Override</Label>
                <Textarea
                  id="justification"
                  placeholder="Explain why you're overriding the calculated tier..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="h-20"
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MaterialityCalculator;
