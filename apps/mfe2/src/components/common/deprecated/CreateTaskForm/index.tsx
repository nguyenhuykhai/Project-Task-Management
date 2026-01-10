import { useState } from "react";
import { Button, DatePicker } from "@repo/ui";
import { useTasks } from "@/contexts/TaskContext";
import type { CreateTaskInput } from "@/types/task";
import { publishEvent } from "@repo/core";
import { format } from "date-fns";

const CreateTaskForm = () => {
  const { createTask } = useTasks();
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: "",
    priority: "medium",
    assignee: "",
    dueDate: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.title.trim()) {
      publishEvent("notification:show", {
        title: "Tiêu đề không hợp lệ!",
        message: "Tiêu đề không hợp lệ",
        type: "error",
        duration: 3000,
      });
      return;
    }
    if (!formData.assignee.trim()) {
      publishEvent("notification:show", {
        title: "Người phụ trách không hợp lệ!",
        message: "Người phụ trách không hợp lệ",
        type: "error",
        duration: 3000,
      });
      return;
    }
    if (!selectedDate) {
      publishEvent("notification:show", {
        title: "Ngày hết hạn không hợp lệ!",
        message: "Ngày hết hạn không hợp lệ",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Create task with formatted date
    createTask({
      ...formData,
      dueDate: format(selectedDate, "yyyy-MM-dd"),
    });

    // Reset form
    setFormData({
      title: "",
      priority: "medium",
      assignee: "",
      dueDate: "",
    });
    setSelectedDate(undefined);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6 border-b bg-muted/30">
        <h2 className="text-xl font-semibold">Tạo nhiệm vụ</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Thêm một nhiệm vụ mới vào danh sách nhiệm vụ của bạn
        </p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-foreground"
            >
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề nhiệm vụ..."
              className="w-full px-3 py-2 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="assignee"
                className="text-sm font-medium text-foreground"
              >
                Người phụ trách <span className="text-red-500">*</span>
              </label>
              <input
                id="assignee"
                name="assignee"
                type="text"
                value={formData.assignee}
                onChange={handleChange}
                placeholder="Nhập người phụ trách..."
                className="w-full px-3 py-2 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Ngày hết hạn <span className="text-red-500">*</span>
              </label>
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                placeholder="Chọn ngày hết hạn"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="priority"
              className="text-sm font-medium text-foreground"
            >
              Mức độ ưu tiên
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              Tạo nhiệm vụ
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  title: "",
                  priority: "medium",
                  assignee: "",
                  dueDate: "",
                });
                setSelectedDate(undefined);
              }}
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
