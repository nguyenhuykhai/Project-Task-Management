"use client";

import { Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Dashboard from "./components/Dashboard";
import GoogleAuth from "./components/GoogleAuth";
import Header from "./components/Header";
import SprintManager from "./components/SprintManager";
import TaskFormModal from "./components/TaskFormModal";
import TaskTable from "./components/TaskTable";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useTaskStore } from "./store/taskStore";
import type { Task } from "./types";

type View = "dashboard" | "sprints";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  const [view, setView] = useState<View>("dashboard");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, sprints, filterValue } = useTaskStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleOpenTaskModal = (task: Task | null = null) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const filteredTasks = useMemo(() => {
    if (filterValue === "all_time") {
      return tasks;
    }

    if (filterValue === "current_sprint") {
      const today = new Date().toISOString().split("T")[0];
      const currentSprint = sprints.find(
        (s) => s.startDate <= today && s.endDate >= today
      );
      return currentSprint
        ? tasks.filter((t) => t.sprintId === currentSprint.id)
        : [];
    }

    if (sprints.some((s) => s.id === filterValue)) {
      return tasks.filter((t) => t.sprintId === filterValue);
    }

    const sprintIdsForMonth = sprints
      .filter(
        (s) =>
          s.startDate.startsWith(filterValue) ||
          s.endDate.startsWith(filterValue)
      )
      .map((s) => s.id);
    return tasks.filter((t) => sprintIdsForMonth.includes(t.sprintId));
  }, [tasks, sprints, filterValue]);

  if (!isAuthenticated) {
    return <GoogleAuth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex flex-col">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>

        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as View)}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-xs grid-cols-2 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="sprints">Sprints</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8">
              <Dashboard tasks={filteredTasks} />

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-2xl">Task Details</CardTitle>
                    <CardDescription>View and manage all tasks</CardDescription>
                  </div>
                  <Button
                    onClick={() => handleOpenTaskModal()}
                    disabled={sprints.length === 0}
                    size="lg"
                    gap-2
                  >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Add Task</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  {sprints.length > 0 ? (
                    <TaskTable
                      tasks={filteredTasks}
                      onEdit={handleOpenTaskModal}
                    />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-base">No sprints found.</p>
                      <p className="text-sm mt-2">
                        Go to "Sprints" to create one before adding tasks.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sprints">
              <SprintManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {isTaskModalOpen && (
        <TaskFormModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default App;
