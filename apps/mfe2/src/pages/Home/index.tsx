import CreateTaskForm from "@/components/common/deprecated/CreateTaskForm";
import { useTasks } from "@/contexts/TaskContext";
import { translatePriority, translateStatus } from "@/lib/function";
import type { Task } from "@/types/task";

const Home = () => {
  const { tasks, taskStats, updateTaskStatus, deleteTask } = useTasks();

  const statusColors = {
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    todo: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const priorityColors = {
    high: "bg-red-500/10 text-red-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    low: "bg-green-500/10 text-green-500",
  };

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Tổng nhiệm vụ
            </p>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold">{taskStats.total}</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Hoàn thành
            </p>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-green-500">
              {taskStats.completed}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Đang tiến hành
            </p>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-blue-500">
              {taskStats.inProgress}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Chưa hoàn thành
            </p>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-500">{taskStats.todo}</p>
          </div>
        </div>
      </div>

      {/* Create Task Form */}
      <CreateTaskForm />

      {/* Recent Tasks */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-6 border-b bg-muted/30">
          <h2 className="text-xl font-semibold">Nhiệm vụ gần đây</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng quan về tất cả các nhiệm vụ trong hệ thống
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{task.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span>👤 {task.assignee}</span>
                      <span>📅 {task.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        priorityColors[
                          task.priority as keyof typeof priorityColors
                        ]
                      }`}
                    >
                      {translatePriority(task.priority)}
                    </span>

                    {/* Status Dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(
                          task.id,
                          e.target.value as Task["status"]
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                        statusColors[task.status as keyof typeof statusColors]
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                    >
                      {["todo", "in-progress", "completed"].map((status) => (
                        <option key={status} value={status}>
                          {translateStatus(status)}
                        </option>
                      ))}
                    </select>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Bạn có chắc chắn muốn xóa nhiệm vụ "${task.title}"?`
                          )
                        ) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      title="Xóa nhiệm vụ"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Chưa có nhiệm vụ nào. Hãy tạo nhiệm vụ đầu tiên!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
