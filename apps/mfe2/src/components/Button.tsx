import React from "react";
import { publishEvent } from "@repo/core/event-bus";
import { Button } from "@repo/ui";

const RemoteButton: React.FC = () => {
  const triggerSuccess = () => {
    publishEvent("notification:show", {
      title: "Success! 🎉",
      message: "Data synced from Remote MFE2 successfully.",
      type: "success",
      duration: 3000,
    });
  };

  return (
    <div className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-1">
            Remote Component
          </h2>
          <p className="text-sm text-muted-foreground">
            Mounted from MFE2 via Module Federation
          </p>
        </div>

        <Button
          onClick={triggerSuccess}
          className="w-full sm:w-auto transition-transform active:scale-95"
        >
          Dispatch Event to Host
        </Button>

        <div className="flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-full w-fit">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Service Connected
        </div>
      </div>
    </div>
  );
};

export default RemoteButton;
