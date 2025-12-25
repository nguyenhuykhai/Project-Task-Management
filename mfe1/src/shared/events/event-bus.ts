import type { ModalPayload, NotificationPayload, ThemePayload } from "@/types";

/**
 * Registry tập trung để quản lý toàn bộ Event trong hệ thống.
 * Giúp mở rộng dễ dàng: Chỉ cần thêm cặp 'key: payload' vào đây.
 */
export interface AppEventMap {
  "notification:show": NotificationPayload;
  "theme:change": ThemePayload;
  "modal:open": ModalPayload;
  "user:session-expired": { reason: string };
}

export const publishEvent = <K extends keyof AppEventMap>(
  event: K,
  detail: AppEventMap[K]
) => {
  const customEvent = new CustomEvent(event, {
    detail,
    bubbles: true,
    composed: true,
  });
  window.dispatchEvent(customEvent);
};

export const subscribeEvent = <K extends keyof AppEventMap>(
  event: K,
  callback: (detail: AppEventMap[K]) => void
) => {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<AppEventMap[K]>;
    callback(customEvent.detail);
  };
  window.addEventListener(event, handler);
  return () => window.removeEventListener(event, handler);
};
