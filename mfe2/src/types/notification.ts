export interface NotificationPayload {
  id?: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ThemePayload {
  theme: "light" | "dark" | "system";
}

export interface ModalPayload {
  id: string;
  type: "confirm" | "alert" | "custom";
  title: string;
  content: string | React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}
