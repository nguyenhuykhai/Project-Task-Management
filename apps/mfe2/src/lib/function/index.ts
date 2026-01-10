import type { IPermission } from "@/types";

export const checkPermissions = (
  permissions: IPermission | IPermission[] | boolean
): boolean => {
  // Stub implementation - customize based on your permission logic
  if (typeof permissions === "boolean") {
    return permissions;
  }

  // If you have a real permission check, implement it here
  // For now, return true to allow access
  return true;
};

export const translatePriority = (priority: string) => {
  switch (priority) {
    case "high":
      return "Cao";
    case "medium":
      return "Trung bình";
    case "low":
      return "Thấp";
    default:
      return priority;
  }
};

export const translateStatus = (status: string) => {
  switch (status) {
    case "all":
      return "Tất cả";
    case "todo":
      return "Chưa hoàn thành";
    case "in-progress":
      return "Đang tiến hành";
    case "completed":
      return "Hoàn thành";
    default:
      return status;
  }
};
