import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@repo/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@repo/ui";
import { useTheme } from "@/components/providers/theme-provider";
import { publishEvent } from "@repo/core";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const handleSetTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    publishEvent("theme:change", {
      theme: theme === "dark" ? "light" : "dark",
    });
  };

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            className="rounded-full w-8 h-8 bg-background mr-2"
            variant="outline"
            size="icon"
            onClick={handleSetTheme}
          >
            <SunIcon className="w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
            <MoonIcon className="absolute w-[1.2rem] h-[1.2rem] rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
            <span className="sr-only">Switch Theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Switch Theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
