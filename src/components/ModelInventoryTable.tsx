
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Plus, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";

interface ModelInventoryTableProps {
  models: Model[];
  onEdit: (model: Model) => void;
  onCreateNew: () => void;
  onViewDetails: (model: Model) => void;
}

const ModelInventoryTable = ({ 
  models, 
  onEdit, 
  onCreateNew, 
  onViewDetails 
}: ModelInventoryTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Model>("lastUpdated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string>("all");

  const handleSort = (column: keyof Model) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Extract unique business units for the filter dropdown
  const businessUnits = useMemo(() => {
    return Array.from(new Set(models.map((model) => model.businessUnit)));
  }, [models]);

  const filteredAndSortedModels = useMemo(() => {
    return [...models]
      // Apply search filter
      .filter((model) => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
          model.name.toLowerCase().includes(searchLower) || 
          model.owner.toLowerCase().includes(searchLower)
        );
      })
      // Apply status filter
      .filter((model) => {
        if (statusFilter === "all") return true;
        return model.status === statusFilter;
      })
      // Apply tier filter
      .filter((model) => {
        if (tierFilter === "all") return true;
        return model.tier === parseInt(tierFilter, 10) as ModelTier;
      })
      // Apply business unit filter
      .filter((model) => {
        if (businessUnitFilter === "all") return true;
        return model.businessUnit === businessUnitFilter;
      })
      // Sort
      .sort((a, b) => {
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
  }, [models, sortColumn, sortDirection, searchTerm, statusFilter, tierFilter, businessUnitFilter]);

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

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by model name or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="1">Tier 1</SelectItem>
              <SelectItem value="2">Tier 2</SelectItem>
              <SelectItem value="3">Tier 3</SelectItem>
            </SelectContent>
          </Select>

          <Select value={businessUnitFilter} onValueChange={setBusinessUnitFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Business Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Business Units</SelectItem>
              {businessUnits.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            {filteredAndSortedModels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  No models found. Create your first model to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedModels.map((model) => (
                <TableRow 
                  key={model.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewDetails(model)}
                >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(model);
                      }}
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
