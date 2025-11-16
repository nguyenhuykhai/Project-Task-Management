import { toast } from 'sonner';
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Sprint, Task, TaskStore } from '../types';
import { persist } from 'zustand/middleware';

// Helper function to transform DB task to app Task
const transformTask = (t: any): Task => ({
  id: t.id,
  user_id: t.user_id,
  sprint_id: t.sprint_id,
  task: t.task,
  link: t.link,
  total_point: t.total_point,
  label: t.label,
  priority: t.priority,
  status: t.status,
  percent: t.percent,
  notes: t.notes,
  owners: t.owners,
  created_at: t.created_at,
  updated_at: t.updated_at,
});

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

// Helper function to fetch all tasks
const fetchTasks = async (userId: string) => {
  const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId);

  if (error) throw error;
  return data ? data.map(transformTask) : [];
};

// Helper function to fetch all sprints
const fetchSprints = async (userId: string) => {
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data ? data.map(transformSprint) : [];
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      sprints: [],
      filterValue: 'current_sprint',

      addTask: async (task: Omit<Task, 'id'>) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticTask: Task = { ...task, id: tempId };

        // Optimistic update
        set((state) => ({ tasks: [...state.tasks, optimisticTask] }));

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const { data, error } = await supabase
            .from('tasks')
            .insert([
              {
                user_id: user.id,
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

          // Replace temp task with real task
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === tempId ? transformTask(data) : t)),
          }));

          toast.success('Task added successfully');
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== tempId),
          }));
          toast.error('Failed to add task: ' + error.message);
          throw error;
        }
      },

      updateTask: async (task) => {
        const previousTasks = get().tasks;

        // Optimistic update
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        }));

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

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
        } catch (error: any) {
          // Rollback on error
          set({ tasks: previousTasks });
          toast.error('Failed to update task: ' + error.message);
          throw error;
        }
      },

      deleteTask: async (id) => {
        const previousTasks = get().tasks;

        // Optimistic update
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));

        try {
          const { error } = await supabase.from('tasks').delete().eq('id', id);

          if (error) throw error;

          toast.success('Task deleted successfully');
        } catch (error: any) {
          // Rollback on error
          set({ tasks: previousTasks });
          toast.error('Failed to delete task: ' + error.message);
          throw error;
        }
      },

      addSprint: async (sprint) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticSprint: Sprint = { ...sprint, id: tempId };

        // Optimistic update
        set((state) => ({ sprints: [optimisticSprint, ...state.sprints] }));

        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const { data, error } = await supabase
            .from('sprints')
            .insert([
              {
                user_id: user.id,
                name: sprint.name,
                start_date: sprint.start_date,
                end_date: sprint.end_date,
              },
            ])
            .select()
            .single();

          if (error) throw error;

          // Replace temp sprint with real sprint
          const realSprint = transformSprint(data);
          set((state) => ({
            sprints: state.sprints.map((s) => (s.id === tempId ? realSprint : s)),
          }));

          toast.success('Sprint added successfully');
          return realSprint;
        } catch (error: any) {
          // Rollback on error
          set((state) => ({
            sprints: state.sprints.filter((s) => s.id !== tempId),
          }));
          toast.error('Failed to add sprint: ' + error.message);
          throw error;
        }
      },

      updateSprint: async (sprint) => {
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
        } catch (error: any) {
          // Rollback on error
          set({ sprints: previousSprints });
          toast.error('Failed to update sprint: ' + error.message);
          throw error;
        }
      },

      deleteSprint: async (id) => {
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
        } catch (error: any) {
          // Rollback on error
          set({ sprints: previousSprints, tasks: previousTasks });
          toast.error('Failed to delete sprint: ' + error.message);
          throw error;
        }
      },

      setFilterValue: (filter) => {
        set({ filterValue: filter });
      },

      importData: async (data) => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          // Show loading toast
          const loadingToast = toast.loading('Importing data...');

          // Delete existing data
          await Promise.all([
            supabase.from('tasks').delete().eq('user_id', user.id),
            supabase.from('sprints').delete().eq('user_id', user.id),
          ]);

          // Import sprints
          const sprintMap = new Map<string, string>();
          for (const sprint of data.sprints) {
            const { data: newSprint, error } = await supabase
              .from('sprints')
              .insert([
                {
                  user_id: user.id,
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
            user_id: user.id,
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

          // Fetch updated data
          const [updatedSprints, updatedTasks] = await Promise.all([
            fetchSprints(user.id),
            fetchTasks(user.id),
          ]);

          set({ sprints: updatedSprints, tasks: updatedTasks });

          toast.dismiss(loadingToast);
          toast.success('Data imported successfully');
        } catch (error: any) {
          toast.error('Failed to import data: ' + error.message);
          throw error;
        }
      },
    }),
    {
      name: 'rescope-task-store',
      partialize: (state) => ({
        tasks: state.tasks,
        sprints: state.sprints,
        filterValue: state.filterValue,
      }),
    },
  ),
);

// Set up initial data fetch and real-time subscriptions
supabase.auth.onAuthStateChange(async (_event, session) => {
  if (session?.user) {
    const userId = session.user.id;

    const { tasks, sprints } = useTaskStore.getState();

    // ✅ Only fetch when empty
    if (tasks.length === 0 || sprints.length === 0) {
      try {
        const [freshTasks, freshSprints] = await Promise.all([
          fetchTasks(userId),
          fetchSprints(userId),
        ]);
        useTaskStore.setState({
          tasks: freshTasks,
          sprints: freshSprints,
        });
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    }

    // Subscriptions stay same as before (no localStorage calls needed)
    supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          try {
            const freshTasks = await fetchTasks(userId);
            useTaskStore.setState((state) => ({
              ...state,
              tasks: freshTasks,
            }));
          } catch (error) {
            console.error('Error fetching tasks on change:', error);
          }
        },
      )
      .subscribe();

    supabase
      .channel('sprints-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sprints',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          try {
            const freshSprints = await fetchSprints(userId);
            useTaskStore.setState((state) => ({
              ...state,
              sprints: freshSprints,
            }));
          } catch (error) {
            console.error('Error fetching sprints on change:', error);
          }
        },
      )
      .subscribe();
  } else {
    useTaskStore.setState({ tasks: [], sprints: [] });
  }
});
