import { useEffect, useState } from "react";
import { subscribeEvent } from "@repo/core/event-bus";

type Theme = "light" | "dark";

export const useThemeSync = () => {
  // 1. Initialize state from localStorage or default to light
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("ui-theme") as Theme) || "light";
    }
    return "light";
  });

  // 2. Function to apply the theme to #mfe2-root (where CSS variables are scoped)
  const applyTheme = (newTheme: Theme) => {
    const mfe2Root = document.getElementById("mfe2-root");

    console.log("🎨 Applying theme:", newTheme);
    console.log("🎯 Target element:", mfe2Root);

    if (mfe2Root) {
      if (newTheme === "dark") {
        mfe2Root.classList.add("dark");
      } else {
        mfe2Root.classList.remove("dark");
      }
    }
  };

  useEffect(() => {
    // Apply initial theme
    applyTheme(theme);

    // Subscribe to theme:change events from event bus (real-time from host app)
    const unsubscribe = subscribeEvent("theme:change", (payload) => {
      const newTheme = payload.theme as Theme;
      setTheme(newTheme);
      applyTheme(newTheme);
    });

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ui-theme" && e.newValue) {
        console.log("💾 Storage changed in another tab:", e.newValue);
        const newTheme = e.newValue as Theme;
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [theme]);

  return { theme };
};
