import { TASK_LABEL, TASK_PRIORITY, TASK_STATUS } from './constants';
import { FetchTasksParams } from './lib/api';

export interface Owner {
  name: string;
  point: number;
}

export interface Sprint {
  id: string;
  user_id: string;
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  sprint_id: string;
  task: string;
  link: string;
  total_point: number;
  label: TASK_LABEL;
  priority: TASK_PRIORITY;
  status: TASK_STATUS;
  percent: string;
  notes: string;
  owners: Owner[];
  created_at: string;
  updated_at: string;
}

export interface TaskWithSprint extends Task {
  id: string;
  user_id: string;
  sprint_id: string;
  task: string;
  link: string;
  total_point: number;
  label: TASK_LABEL;
  priority: TASK_PRIORITY;
  status: TASK_STATUS;
  percent: string;
  notes: string;
  owners: Owner[];
  created_at: string;
  updated_at: string;
  sprint?: Sprint;
}

export type FilterValue = 'all_time' | string;

export interface TaskStore {
  tasks: Task[] | [];
  sprints: Sprint[] | [];
  filterValue: FilterValue;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;

  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  refreshTasks: () => Promise<void>;
  loadTasks: (overrides?: Partial<FetchTasksParams>) => Promise<void>;
  loadSprints: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addSprint: (
    sprint: Omit<Sprint, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  ) => Promise<void>;
  updateSprint: (sprint: Sprint) => Promise<void>;
  deleteSprint: (id: string) => Promise<void>;
  setFilterValue: (filter: FilterValue) => void;
  importData: (data: { tasks: Task[]; sprints: Sprint[] }) => Promise<void>;
  setupRealtimeSubscriptions: () => void;
}
