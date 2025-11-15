"use client";

import React, { useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, Upload, CheckCircle } from "lucide-react";
import Papa from "papaparse";
import { Owner, Task } from "@/types";

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportCSVModal({
  isOpen,
  onClose,
}: ImportCSVModalProps) {
  const { sprints, addTask } = useTaskStore();
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "text/csv") {
      setFile(selected);
      setError("");
    } else {
      setError("Please upload a valid CSV file");
    }
  };

  const parseAndImport = async () => {
    if (!file || !selectedSprintId) {
      setError("Please select a sprint and upload a CSV file");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const tasks = results.data as any[];
          let imported = 0;

          for (const row of tasks) {
            // Extract owners (up to 6)
            const owners: Owner[] = [];
            for (let i = 1; i <= 6; i++) {
              const name = row[`Owner ${i}`]?.trim();
              const pointStr = row[`Point ${i}`]?.trim();
              if (name && pointStr) {
                const point = parseFloat(pointStr);
                if (!isNaN(point)) {
                  owners.push({ name, point });
                }
              }
            }

            if (owners.length === 0) continue; // Skip if no owners

            const totalPoint = owners.reduce((sum, o) => sum + o.point, 0);

            const task = {
              sprintId: selectedSprintId,
              task: row.Task?.trim() || "Untitled Task",
              link: row.Link?.trim() || "",
              totalPoint,
              label: (row.Label as Task["label"]) || "COULD HAVE",
              priority: (row.Priority as Task["priority"]) || "Medium",
              status: (row.Status as Task["status"]) || "To Do",
              percent: row.Percent?.trim() || "",
              notes: row.Notes?.trim() || "",
              owners,
            };

            await addTask(task);
            imported++;
          }

          setSuccess(`Successfully imported ${imported} task(s)`);
          setTimeout(() => {
            onClose();
            setFile(null);
            setSelectedSprintId("");
          }, 1500);
        } catch (err: any) {
          setError("Import failed: " + err.message);
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        setError("CSV parsing failed: " + err.message);
        setLoading(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Tasks from CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sprint Selector */}
          <div>
            <Label htmlFor="sprint">Select Sprint</Label>
            <Select
              value={selectedSprintId}
              onValueChange={setSelectedSprintId}
            >
              <SelectTrigger id="sprint">
                <SelectValue placeholder="Choose a sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name} ({sprint.startDate} → {sprint.endDate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="csv">CSV File</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-border">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="flex text-sm text-muted-foreground">
                  <label
                    htmlFor="csv-file"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                  >
                    <span>Upload a file</span>
                    <input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {file ? file.name : "CSV up to 10MB"}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={parseAndImport}
            disabled={loading || !file || !selectedSprintId}
          >
            {loading ? "Importing..." : "Import Tasks"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
