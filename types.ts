export interface Owner {
  name: string;
  point: number;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface Task {
  id: string;
  sprintId: string;
  task: string;
  link: string;
  totalPoint: number;
  label: "MUST HAVE" | "SHOULD HAVE" | "COULD HAVE" | "WON'T HAVE";
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In progress" | "Done";
  percent: string;
  notes: string;
  owners: Owner[];
}
export type FilterValue = "current_sprint" | "all_time" | string; // string can be sprintId or month YYYY-MM

export interface TaskStore {
  tasks: Task[];
  sprints: Sprint[];
  filterValue: FilterValue;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addSprint: (sprint: Omit<Sprint, "id">) => Promise<Sprint>;
  updateSprint: (sprint: Sprint) => void;
  deleteSprint: (id: string) => void;
  setFilterValue: (filter: FilterValue) => void;
  importData: (data: { tasks: Task[]; sprints: Sprint[] }) => void;
}
