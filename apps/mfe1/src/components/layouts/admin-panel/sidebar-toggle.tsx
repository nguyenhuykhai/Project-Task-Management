import { ChevronLeft } from "lucide-react";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible absolute top-[12px] -right-[16px] z-20">
      <Button
        onClick={() => setIsOpen?.()}
        className={cn(
          "rounded-md w-8 h-8 transition-colors",
          // Added dark mode styles for the button background and border
          "bg-background dark:bg-zinc-800 border border-border dark:border-zinc-700 hover:bg-accent dark:hover:bg-zinc-700"
        )}
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700 text-foreground dark:text-gray-100",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
