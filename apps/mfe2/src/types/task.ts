export interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
}

export interface CreateTaskInput {
  title: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
}
