import { TASK_LABEL, TASK_PRIORITY, TASK_STATUS } from './constants';

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
export type FilterValue = 'current_sprint' | 'all_time' | string;

export interface TaskStore {
  tasks: Task[] | [];
  sprints: Sprint[] | [];
  filterValue: FilterValue;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addSprint: (sprint: Omit<Sprint, 'id'>) => Promise<Sprint>;
  updateSprint: (sprint: Sprint) => void;
  deleteSprint: (id: string) => void;
  setFilterValue: (filter: FilterValue) => void;
  importData: (data: { tasks: Task[]; sprints: Sprint[] }) => void;
}
