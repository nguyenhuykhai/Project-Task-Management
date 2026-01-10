import { useState } from "react";
import { useTasks } from "@/contexts/TaskContext";
import type { Task } from "@/types/task";
import { translatePriority, translateStatus } from "@/lib/function";

const Detail = () => {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();
  const [filter, setFilter] = useState<string>("all");

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const statusColors = {
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    todo: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  const priorityColors = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-green-500",
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Chi tiết</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Xem thông tin chi tiết của tất cả các nhiệm vụ
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["all", "todo", "in-progress", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {translateStatus(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
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
                      <option value="todo">CHƯA HOÀN THÀNH</option>
                      <option value="in-progress">ĐANG TIẾN HÀNH</option>
                      <option value="completed">HOÀN THÀNH</option>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">
                      Mức độ ưu tiên:
                    </span>
                    <span
                      className={`font-semibold ${
                        priorityColors[
                          task.priority as keyof typeof priorityColors
                        ]
                      }`}
                    >
                      {translatePriority(task.priority)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">
                      Người phụ trách:
                    </span>
                    <span className="font-semibold">{task.assignee}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">
                      Ngày hết hạn:
                    </span>
                    <span className="font-semibold">{task.dueDate}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    ID nhiệm vụ: <span className="font-mono">#{task.id}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">Không tìm thấy nhiệm vụ nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
