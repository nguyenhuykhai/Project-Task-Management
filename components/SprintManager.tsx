"use client";

import React, { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import type { Sprint } from "../types";
import { Edit, Trash2, Plus, Upload } from "lucide-react";
import SprintFormModal from "./SprintFormModal";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import ImportCSVModal from "./ImportCSVModal";

const SprintManager: React.FC = () => {
  const sprints = useTaskStore((state) => state.sprints);
  const deleteSprint = useTaskStore((state) => state.deleteSprint);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const handleOpenModal = (sprint: Sprint | null = null) => {
    setEditingSprint(sprint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingSprint(null);
    setIsModalOpen(false);
  };

  const sortedSprints = [...sprints].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl">Manage Sprints</CardTitle>
            <CardDescription>
              Create and manage your project sprints
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} />
            <span className="hidden sm:inline">Add Sprint</span>
          </Button>
          <Button
            onClick={() => setImportOpen(true)}
            variant="outline"
            size="sm"
          >
            <Upload size={16} className="mr-2" />
            Import CSV
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const csv = `Task,Link,Total Point,Label,Priority,Status,Percent,Notes,Owner 1,Point 1,Owner 2,Point 2,Owner 3,Point 3,Owner 4,Point 4,Owner 5,Point 5,Owner 6,Point 6\nNew Task,https://github.com/...,5,MUST HAVE,High,To Do,0%,,Alice,3,Bob,2,,,`;
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "task-template.csv";
              a.click();
            }}
          >
            Download Template
          </Button>

          <ImportCSVModal
            isOpen={importOpen}
            onClose={() => setImportOpen(false)}
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sprint Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSprints.length > 0 ? (
                  sortedSprints.map((sprint) => (
                    <TableRow key={sprint.id}>
                      <TableCell className="font-medium">
                        {sprint.name}
                      </TableCell>
                      <TableCell>{sprint.startDate}</TableCell>
                      <TableCell>{sprint.endDate}</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(sprint)}
                          className="h-8 w-8"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            window.confirm(
                              "Are you sure? This will also delete all tasks in this sprint."
                            ) && deleteSprint(sprint.id)
                          }
                          className="h-8 w-8 hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No sprints yet. Create one to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <SprintFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          sprint={editingSprint}
        />
      )}
    </div>
  );
};

export default SprintManager;
