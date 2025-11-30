'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import GoogleAuth from './components/GoogleAuth';
import Header from './components/Header';
import SprintManager from './components/SprintManager';
import TaskFormModal from './components/TaskFormModal';
import TaskTable from './components/TaskTable';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { useAuthStore } from './store/authStore';
import { useTaskStore } from './store/taskStore';
import type { Task } from './types';
import { Input } from './components/ui/input';
import { debounce } from 'lodash';
import { PAGE_SIZE } from './lib/api';

type View = 'dashboard' | 'sprints';

const App: React.FC = () => {
  // Auth store
  const { isAuthenticated, initializeAuth } = useAuthStore();

  // Task store
  const {
    tasks,
    sprints,
    filterValue,
    loadTasks,
    loadSprints,
    setupRealtimeSubscriptions,
    setSearchQuery,
    searchQuery,
    isLoading,
    totalCount,
    setCurrentPage,
    totalPages,
    currentPage,
  } = useTaskStore();

  // Local variables
  const [view, setView] = useState<View>('dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // Functions
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
    if (filterValue === 'all_time') return tasks;

    if (sprints.some((s) => s.id === filterValue)) {
      return tasks.filter((t) => t.sprint_id === filterValue);
    }

    const sprintIdsForMonth = sprints
      .filter((s) => s?.start_date?.startsWith(filterValue) || s?.end_date?.startsWith(filterValue))
      .map((s) => s?.id);
    return tasks.filter((t) => sprintIdsForMonth?.includes(t.sprint_id));
  }, [tasks, sprints, filterValue]);

  // Effects
  useEffect(() => {
    const debouncedSearch = debounce(() => setSearchQuery(searchValue), 300);
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchValue]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Load data and setup subscriptions when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
      loadSprints();
      setupRealtimeSubscriptions();
    }
  }, [isAuthenticated, loadTasks, loadSprints, setupRealtimeSubscriptions]);

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  if (!isAuthenticated) {
    return <GoogleAuth onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex flex-col">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>

        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={view} onValueChange={(v) => setView(v as View)} className="w-full">
            <TabsList className="grid w-full max-w-xs grid-cols-2 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="sprints">Sprints</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8">
              <Dashboard tasks={tasks} sprints={sprints} />

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-2xl">Task Details</CardTitle>
                    <CardDescription>View and manage all tasks</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search */}
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search tasks, owners, labels..."
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {isLoading
                          ? 'Loading...'
                          : `${totalCount} task${totalCount !== 1 ? 's' : ''}`}
                      </span>
                    </div>

                    <Button
                      onClick={() => handleOpenTaskModal()}
                      disabled={sprints.length === 0}
                      size="lg"
                      className="gap-2"
                    >
                      <Plus size={20} />
                      <span className="hidden sm:inline">Add Task</span>
                    </Button>
                  </div>

                  {sprints.length > 0 ? (
                    <>
                      <TaskTable tasks={filteredTasks} onEdit={handleOpenTaskModal} />
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                            {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} tasks
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                            >
                              <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <span className="px-4 text-sm">
                              Page {currentPage} of {totalPages}
                            </span>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                            >
                              <ChevronsRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
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
        <TaskFormModal isOpen={isTaskModalOpen} onClose={handleCloseTaskModal} task={editingTask} />
      )}
    </div>
  );
};

export default App;
