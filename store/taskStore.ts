'use client';

import { toast } from 'sonner';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Sprint, Task, TaskStore } from '../types';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import { fetchTasks, type FetchTasksParams } from '@/lib/api';
import { debounce } from 'lodash';

// Helper function to transform DB sprint to app Sprint
const transformSprint = (s: any): Sprint => ({
  id: s.id,
  user_id: s.user_id,
  name: s.name,
  start_date: s.start_date,
  end_date: s.end_date,
  created_at: s.created_at,
  updated_at: s.updated_at,
});

// Helper function to fetch all sprints (NO user filter) // CHANGED
const fetchSprints = async () => {
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data ? data.map(transformSprint) : [];
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      sprints: [],
      isLoading: false,

      // Filter & Pagination
      filterValue: 'all_time',
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,

      // Setters
      setSearchQuery: (query: string) => {
        set({ searchQuery: query, currentPage: 1 });
        get().loadTasks();
      },
      setCurrentPage: (page: number) => {
        set({ currentPage: page });
        get().refreshTasks();
      },
      setFilterValue: (filter: string) => {
        set({ filterValue: filter, currentPage: 1 });
        get().loadTasks();
      },

      loadTasks: async (overrides?: Partial<FetchTasksParams>) => {
        const state = get();
        const params: FetchTasksParams = {
          filterValue: state.filterValue,
          searchQuery: state.searchQuery,
          page: state.currentPage,
          ...overrides,
        };

        set({ isLoading: true });

        try {
          const result = await fetchTasks(params);

          set({
            tasks: result.tasks,
            totalCount: result.totalCount,
            totalPages: result.totalPages,
            isLoading: false,
          });
        } catch (error: any) {
          console.error('Failed to load tasks:', error);
          toast.error('Failed to load tasks');
          set({ tasks: [], totalPages: 1, isLoading: false });
        }
      },

      // Call loadTasks on any change
      refreshTasks: () => get().loadTasks(),
      refreshSprints: () => get().loadSprints(),

      // Load ALL sprints, not by user_id // CHANGED
      loadSprints: async () => {
        try {
          const sprints = await fetchSprints();
          set({ sprints });
        } catch (error) {
          console.error('Failed to load sprints:', error);
          toast.error('Failed to load sprints');
        }
      },

      addTask: async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        const userId = useAuthStore.getState().userId;
        if (!userId) throw new Error('User not authenticated');

        const tempId = `temp-${Date.now()}`;
        const optimisticTask: Task = {
          ...task,
          id: tempId,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Optimistic update
        set((state) => ({ tasks: [...state.tasks, optimisticTask] }));

        try {
          const { data, error } = await supabase
            .from('tasks')
            .insert([
              {
                user_id: userId,
                sprint_id: task.sprint_id,
                task: task.task,
                link: task.link,
                total_point: task.total_point,
                label: task.label,
                priority: task.priority,
                status: task.status,
                percent: task.percent,
                notes: task.notes,
                owners: task.owners,
              },
            ])
            .select()
            .single();

          if (error) throw error;

          toast.success('Task added successfully');
          await get().loadTasks();
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== tempId),
          }));
          toast.error('Failed to add task: ' + error.message);
          throw error;
        }
      },

      updateTask: async (task: Task) => {
        const previousTasks = get().tasks;

        // Optimistic update
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        }));

        try {
          const { error } = await supabase
            .from('tasks')
            .update({
              sprint_id: task.sprint_id,
              task: task.task,
              link: task.link,
              total_point: task.total_point,
              label: task.label,
              priority: task.priority,
              status: task.status,
              percent: task.percent,
              notes: task.notes,
              owners: task.owners,
              updated_at: new Date().toISOString(),
            })
            .eq('id', task.id);

          if (error) throw error;

          toast.success('Task updated successfully');
          await get().loadTasks();
        } catch (error: any) {
          // Rollback on error
          set({ tasks: previousTasks });
          toast.error('Failed to update task: ' + error.message);
          throw error;
        }
      },

      deleteTask: async (id: string) => {
        const previousTasks = get().tasks;

        // Optimistic update
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));

        try {
          const { error } = await supabase.from('tasks').delete().eq('id', id);

          if (error) throw error;

          toast.success('Task deleted successfully');
          await get().loadTasks();
        } catch (error: any) {
          // Rollback on error
          set({ tasks: previousTasks });
          toast.error('Failed to delete task: ' + error.message);
          throw error;
        }
      },

      addSprint: async (sprint: Omit<Sprint, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        const userId = useAuthStore.getState().userId;
        if (!userId) throw new Error('User not authenticated');

        const tempId = `temp-${Date.now()}`;
        const optimisticSprint: Sprint = {
          ...sprint,
          id: tempId,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Optimistic update
        set((state) => ({ sprints: [optimisticSprint, ...state.sprints] }));

        try {
          const { data, error } = await supabase
            .from('sprints')
            .insert([
              {
                user_id: userId,
                name: sprint.name,
                start_date: sprint.start_date,
                end_date: sprint.end_date,
              },
            ])
            .select()
            .single();

          if (error) throw error;

          toast.success('Sprint added successfully');
          await get().loadSprints();
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            sprints: state.sprints.filter((s) => s.id !== tempId),
          }));
          toast.error('Failed to add sprint: ' + error.message);
          throw error;
        }
      },

      updateSprint: async (sprint: Sprint) => {
        const previousSprints = get().sprints;

        // Optimistic update
        set((state) => ({
          sprints: state.sprints.map((s) => (s.id === sprint.id ? sprint : s)),
        }));

        try {
          const { error } = await supabase
            .from('sprints')
            .update({
              name: sprint.name,
              start_date: sprint.start_date,
              end_date: sprint.end_date,
              updated_at: new Date().toISOString(),
            })
            .eq('id', sprint.id);

          if (error) throw error;

          toast.success('Sprint updated successfully');
          await get().loadSprints();
        } catch (error: any) {
          // Rollback on error
          set({ sprints: previousSprints });
          toast.error('Failed to update sprint: ' + error.message);
          throw error;
        }
      },

      deleteSprint: async (id: string) => {
        const previousSprints = get().sprints;
        const previousTasks = get().tasks;

        // Optimistic update
        set((state) => ({
          sprints: state.sprints.filter((s) => s.id !== id),
          tasks: state.tasks.filter((t) => t.sprint_id !== id),
        }));

        try {
          // Delete related tasks first
          const { error: tasksError } = await supabase.from('tasks').delete().eq('sprint_id', id);

          if (tasksError) throw tasksError;

          // Delete sprint
          const { error } = await supabase.from('sprints').delete().eq('id', id);

          if (error) throw error;

          toast.success('Sprint and related tasks deleted successfully');
          await get().loadSprints();
        } catch (error: any) {
          // Rollback on error
          set({ sprints: previousSprints, tasks: previousTasks });
          toast.error('Failed to delete sprint: ' + error.message);
          throw error;
        }
      },

      importData: async (data: { tasks: Task[]; sprints: Sprint[] }) => {
        const userId = useAuthStore.getState().userId;
        if (!userId) throw new Error('User not authenticated');

        try {
          // Show loading toast
          const loadingToast = toast.loading('Importing data...');

          // Delete existing data (still only for this user)
          await Promise.all([
            supabase.from('tasks').delete().eq('user_id', userId),
            supabase.from('sprints').delete().eq('user_id', userId),
          ]);

          // Import sprints
          const sprintMap = new Map<string, string>();
          for (const sprint of data.sprints) {
            const { data: newSprint, error } = await supabase
              .from('sprints')
              .insert([
                {
                  user_id: userId,
                  name: sprint.name,
                  start_date: sprint.start_date,
                  end_date: sprint.end_date,
                },
              ])
              .select()
              .single();

            if (error) throw error;
            sprintMap.set(sprint.id, newSprint.id);
          }

          // Import tasks with new sprint IDs
          const tasksToInsert = data.tasks.map((task) => ({
            user_id: userId,
            sprint_id: sprintMap.get(task.sprint_id) || task.sprint_id,
            task: task.task,
            link: task.link,
            total_point: task.total_point,
            label: task.label,
            priority: task.priority,
            status: task.status,
            percent: task.percent,
            notes: task.notes,
            owners: task.owners,
          }));

          const { error: tasksError } = await supabase.from('tasks').insert(tasksToInsert);

          if (tasksError) throw tasksError;

          // Load updated data
          await Promise.all([get().loadSprints(), get().loadTasks()]);
          toast.dismiss(loadingToast);
          toast.success('Data imported successfully');
        } catch (error: any) {
          toast.error('Failed to import data: ' + error.message);
          throw error;
        }
      },

      // Setup realtime subscriptions (listen to ALL changes, no user filter) // CHANGED
      setupRealtimeSubscriptions: () => {
        supabase
          .channel('tasks-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
            get().loadTasks(); // Auto-refresh on any change
          })
          .subscribe();

        supabase
          .channel('sprints-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'sprints' }, () => {
            get().loadSprints();
            get().loadTasks(); // Sprint change may affect current_sprint filter
          })
          .subscribe();
      },
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        filterValue: state.filterValue,
        searchQuery: state.searchQuery,
        currentPage: state.currentPage,
      }),
    },
  ),
);
