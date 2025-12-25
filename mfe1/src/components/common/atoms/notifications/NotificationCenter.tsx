import React, { useEffect } from "react";
import { Notification } from "./Notification"; // Component UI của bạn
import { useNotificationStore } from "@/store/notificationStore";
import { subscribeEvent } from "@/shared/events/event-bus";

export const NotificationCenter: React.FC = () => {
  const { notifications, addNotification, removeNotification } =
    useNotificationStore();

  useEffect(() => {
    // Pipe: Lắng nghe Event Bus -> Đẩy vào Zustand Store
    const unSub = subscribeEvent("notification:show", (payload) => {
      addNotification(payload);
    });

    return unSub;
  }, [addNotification]);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {notifications.map((notif) => (
        <div key={notif.id} className="pointer-events-auto">
          <Notification notification={notif} onClose={removeNotification} />
        </div>
      ))}
    </div>
  );
};
