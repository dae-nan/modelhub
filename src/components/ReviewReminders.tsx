
import { useState, useMemo } from "react";
import { Model } from "@/types/model";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

type FilterStatus = "all" | "due" | "overdue";

interface ReviewRemindersProps {
  models: Model[];
  onSelectModel: (modelId: string) => void;
}

const ReviewReminders = ({ models, onSelectModel }: ReviewRemindersProps) => {
  const [filter, setFilter] = useState<FilterStatus>("all");

  const isModelReviewDue = (model: Model): boolean => {
    const reviewDate = model.reviewDate || model.lastUpdated;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return new Date(reviewDate) <= oneYearAgo;
  };

  const isModelReviewOverdue = (model: Model): boolean => {
    const reviewDate = model.reviewDate || model.lastUpdated;
    const fifteenMonthsAgo = new Date();
    fifteenMonthsAgo.setMonth(fifteenMonthsAgo.getMonth() - 15);
    
    return new Date(reviewDate) <= fifteenMonthsAgo;
  };

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      if (filter === "all") {
        return true;
      } else if (filter === "due") {
        return isModelReviewDue(model) && !isModelReviewOverdue(model);
      } else if (filter === "overdue") {
        return isModelReviewOverdue(model);
      }
      return false;
    });
  }, [models, filter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (model: Model) => {
    if (isModelReviewOverdue(model)) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (isModelReviewDue(model)) {
      return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Due</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl">Review Reminders</CardTitle>
          <CardDescription>Models requiring review based on last update</CardDescription>
        </div>
        <Select value={filter} onValueChange={(value) => setFilter(value as FilterStatus)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="due">Due</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {filteredModels.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No models match the selected filter
          </div>
        ) : (
          <div className="space-y-4">
            {filteredModels.map((model) => (
              <div 
                key={model.id}
                className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectModel(model.id)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{model.name}</span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>
                      Review{model.reviewDate ? ": " + formatDate(model.reviewDate) : " due"}
                    </span>
                  </div>
                </div>
                {getStatusBadge(model)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewReminders;
