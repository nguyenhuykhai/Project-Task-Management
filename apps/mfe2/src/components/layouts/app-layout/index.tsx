import { type ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui";
import { TaskProvider } from "@/contexts/TaskContext";
import AppProvider from "../app-provider";

const AppLayoutContent = ({ children }: { children?: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current tab based on route
  const currentTab = location.pathname === "/" ? "overview" : "details";

  const handleTabChange = (value: string) => {
    if (value === "overview") {
      navigate("/");
    } else if (value === "details") {
      navigate("/detail");
    }
  };

  return (
    <div className="min-h-screen w-full bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark transition-colors duration-300">
      {/* Header with Tabs */}
      <header className="border-b bg-card dark:bg-card-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold">Task Management</h1>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Remote Application (MFE2)
              </p>
            </div>

            {/* Tab Navigation using shadcn Tabs */}
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="details">Chi tiết</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children ? <>{children}</> : <Outlet />}
      </main>
    </div>
  );
};

const AppLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <AppProvider>
      <TaskProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </TaskProvider>
    </AppProvider>
  );
};

export default AppLayout;
