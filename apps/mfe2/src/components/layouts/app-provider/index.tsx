import React, { type ReactNode, useState } from "react";
import "../../../mfe2.css";
import { Outlet } from "react-router";
import { useThemeSync } from "@/hooks/useThemeSync";
import { PortalContainerProvider } from "@repo/ui";

interface AppProviderProps {
  children?: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({
  children,
}: AppProviderProps) => {
  // Sync theme from localStorage (ui-theme)
  useThemeSync();

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div id="mfe2-root" ref={setContainer}>
      <PortalContainerProvider container={container}>
        {children ? <>{children}</> : <Outlet />}
      </PortalContainerProvider>
    </div>
  );
};

export default AppProvider;
