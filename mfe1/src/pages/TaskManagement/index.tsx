import { ErrorFallback } from "@/components/common/remote-wrapper";
import { LoaderTwo } from "@/components/ui/loader";
import { createRemoteAppComponent } from "@module-federation/bridge-react";
import { loadRemote } from "@module-federation/runtime";

const TaskManagement = createRemoteAppComponent({
  loader: () => loadRemote("remote/Button"),
  loading: <LoaderTwo />,
  fallback: (error: any) => <ErrorFallback error={error} />,
});

export default TaskManagement;
