import React from "react";
import { publishEvent } from "@/shared/events/event-bus";

const Button: React.FC = () => {
  const triggerSuccess = () => {
    publishEvent("notification:show", {
      title: "Thành công!",
      message: "Dữ liệu từ Remote MFE2 đã được đồng bộ.",
      type: "success",
      duration: 3000,
    });
  };

  return (
    <div>
      <h2>Remote Button Component</h2>
      <button
        style={{ padding: "10px 20px", fontSize: "16px" }}
        onClick={triggerSuccess}
      >
        Click me from Remote!
      </button>
      <p style={{ fontSize: "12px", color: "green" }}>
        ✓ Connected to host - Notification service ready
      </p>
    </div>
  );
};

export default Button;
