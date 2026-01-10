import { createContext, useContext, useState, type ReactNode } from "react";
import { publishEvent } from "@repo/core/event-bus";
import type { Task, CreateTaskInput } from "@/types/task";

// Initial dummy tasks
const initialTasks: Task[] = [];

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}

interface TaskContextType {
  tasks: Task[];
  taskStats: TaskStats;
  createTask: (input: CreateTaskInput) => void;
  updateTaskStatus: (taskId: number, newStatus: Task["status"]) => void;
  deleteTask: (taskId: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const taskStats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  const createTask = (input: CreateTaskInput) => {
    // Generate new task ID
    const newId = Math.max(...tasks.map((t) => t.id), 0) + 1;

    // Create new task with default status "todo"
    const newTask: Task = {
      id: newId,
      ...input,
      status: "todo",
    };

    // Update tasks state
    setTasks((prevTasks) => [newTask, ...prevTasks]);

    // Notify host app via event bus
    publishEvent("notification:show", {
      title: "Tạo nhiệm vụ thành công! 🎉",
      message: `Nhiệm vụ "${input.title}" đã được tạo thành công`,
      type: "success",
      duration: 3000,
    });
  };

  const updateTaskStatus = (taskId: number, newStatus: Task["status"]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Find the task to get its title for the notification
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const statusText =
        newStatus === "completed"
          ? "Hoàn thành"
          : newStatus === "in-progress"
            ? "Đang tiến hành"
            : "Chưa hoàn thành";

      publishEvent("notification:show", {
        title: "Cập nhật trạng thái thành công! ✅",
        message: `Nhiệm vụ "${task.title}" đã được chuyển sang trạng thái: ${statusText}`,
        type: "success",
        duration: 3000,
      });
    }
  };

  const deleteTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    if (task) {
      publishEvent("notification:show", {
        title: "Xóa nhiệm vụ thành công! 🗑️",
        message: `Nhiệm vụ "${task.title}" đã được xóa`,
        type: "success",
        duration: 3000,
      });
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, taskStats, createTask, updateTaskStatus, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
