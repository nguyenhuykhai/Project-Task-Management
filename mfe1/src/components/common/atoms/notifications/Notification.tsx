import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import type { NotificationPayload } from "@/types/notification";

interface NotificationProps {
  notification: NotificationPayload;
  onClose: (id: string) => void;
}

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const bgColorMap = {
  success:
    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  warning:
    "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
};

export const Notification: React.FC<NotificationProps> = ({
  notification,
  onClose,
}) => {
  useEffect(() => {
    // Animation entrance
    if (!notification.id) return;
    const element = document.getElementById(notification.id);
    if (element) {
      element.classList.add("animate-slide-in");
    }
  }, [notification.id]);

  return (
    <div
      id={notification.id}
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        ${bgColorMap[notification.type]}
        transform transition-all duration-300 ease-in-out
        hover:shadow-xl
      `}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{iconMap[notification.type]}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {notification.title}
        </h4>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {notification.message}
        </p>

        {/* Action Button */}
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {notification.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => notification?.id && onClose(notification.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
