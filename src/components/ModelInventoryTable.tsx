
import { Model, ModelStatus, ModelTier } from "@/types/model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useState, useMemo } from "react";

interface ModelInventoryTableProps {
  models: Model[];
  onEdit: (model: Model) => void;
  onCreateNew: () => void;
}

const ModelInventoryTable = ({ models, onEdit, onCreateNew }: ModelInventoryTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Model>("lastUpdated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (column: keyof Model) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedModels = useMemo(() => {
    return [...models].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [models, sortColumn, sortDirection]);

  const getStatusColor = (status: ModelStatus) => {
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

  const getTierColor = (tier: ModelTier) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-modelhub-text-primary">Model Inventory</h2>
        <Button onClick={onCreateNew} className="bg-modelhub-primary hover:bg-modelhub-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create New Model
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-modelhub-secondary hover:bg-modelhub-secondary">
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Model Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("owner")}
              >
                Owner {sortColumn === "owner" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("tier")}
              >
                Tier {sortColumn === "tier" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status {sortColumn === "status" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("lastUpdated")}
              >
                Last Updated {sortColumn === "lastUpdated" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedModels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  No models found. Create your first model to get started.
                </TableCell>
              </TableRow>
            ) : (
              sortedModels.map((model) => (
                <TableRow key={model.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>{model.owner}</TableCell>
                  <TableCell>
                    <Badge className={getTierColor(model.tier)}>Tier {model.tier}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(model.lastUpdated)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(model)}
                      className="text-modelhub-primary border-modelhub-primary hover:bg-modelhub-secondary"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ModelInventoryTable;
