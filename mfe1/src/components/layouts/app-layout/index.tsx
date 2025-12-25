import { SidebarProvider } from "@/components/ui/sidebar";
import { type ReactNode } from "react";
import { Outlet } from "react-router";
import AdminPanelLayout from "../admin-panel/admin-panel-layout";
import { ContentLayout } from "../admin-panel/content-layout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NotificationCenter } from "@/components/common/atoms/notifications/NotificationCenter";

const AppLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <SidebarProvider>
        <div className="h-screen">
          <AdminPanelLayout>
            <ContentLayout title="Project Task Management">
              {children ? <>{children}</> : <Outlet />}
            </ContentLayout>
          </AdminPanelLayout>
        </div>
      </SidebarProvider>
      <NotificationCenter />
    </ThemeProvider>
  );
};

export default AppLayout;
