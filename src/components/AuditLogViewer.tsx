
import { useState, useEffect } from "react";
import { AuditLogEntry, AuditLogAction } from "@/types/model";
import { getAuditLogsForModel, getAuditLogs } from "@/lib/storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditLogViewerProps {
  modelId?: string; // Optional - if provided, shows logs only for this model
}

const AuditLogViewer = ({ modelId }: AuditLogViewerProps) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchLogs = () => {
      const auditLogs = modelId ? getAuditLogsForModel(modelId) : getAuditLogs();
      const sortedLogs = [...auditLogs].sort((a, b) => {
        const comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        return sortDirection === "asc" ? -comparison : comparison;
      });
      setLogs(sortedLogs);
    };

    fetchLogs();
  }, [modelId, sortDirection]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatValue = (value: string | undefined) => {
    if (value === undefined) return "-";
    
    try {
      // Try to parse JSON to format it nicely
      const parsedValue = JSON.parse(value);
      if (typeof parsedValue === "object" && parsedValue !== null) {
        return JSON.stringify(parsedValue, null, 2).slice(0, 100) + (JSON.stringify(parsedValue).length > 100 ? "..." : "");
      }
      return parsedValue.toString();
    } catch {
      // If not valid JSON, return as is
      return value;
    }
  };

  const getActionBadge = (action: AuditLogAction) => {
    switch (action) {
      case "create":
        return <Badge className="bg-green-100 text-green-800">Created</Badge>;
      case "update":
        return <Badge className="bg-blue-100 text-blue-800">Updated</Badge>;
      case "delete":
        return <Badge className="bg-red-100 text-red-800">Deleted</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{action}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <CardTitle>Audit Log</CardTitle>
          </div>
          <CardDescription>
            {modelId ? "Changes for this model" : "All model changes"}
          </CardDescription>
        </div>
        <Select value={sortDirection} onValueChange={(value) => setSortDirection(value as "asc" | "desc")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No audit logs found
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Timestamp</TableHead>
                  {!modelId && <TableHead>Model</TableHead>}
                  <TableHead>Action</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Modified By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">{formatTimestamp(log.timestamp)}</TableCell>
                    {!modelId && <TableCell>{log.modelName}</TableCell>}
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>{log.field || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {formatValue(log.oldValue)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {formatValue(log.newValue)}
                    </TableCell>
                    <TableCell>{log.modifiedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
