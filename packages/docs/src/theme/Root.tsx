import React, { useEffect } from "react";

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to apply theme
    function applyTheme(theme: "dark" | "light") {
      const html = document.documentElement;
      html.setAttribute("data-theme", theme);

      // Also update localStorage to persist the theme
      localStorage.setItem("theme", theme);
    }

    // Listen for theme messages from parent window (mfe1)
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== "http://localhost:3001") return;

      if (event.data?.theme) {
        const newTheme = event.data.theme;
        applyTheme(newTheme === "dark" ? "dark" : "light");
      }
    };

    window.addEventListener("message", handleMessage);

    // Apply initial theme from localStorage if exists
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      applyTheme(savedTheme);
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return <>{children}</>;
}
