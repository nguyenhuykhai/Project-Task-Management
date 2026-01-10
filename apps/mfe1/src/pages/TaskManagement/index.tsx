import { ErrorFallback } from "@/components/common/remote-wrapper";
import { LoaderTwo } from "@repo/ui";
import { createRemoteAppComponent } from "@module-federation/bridge-react";
import { loadRemote } from "@module-federation/runtime";

const TaskManagement = createRemoteAppComponent({
  loader: () => loadRemote("remote/RemoteApp"),
  loading: <LoaderTwo />,
  fallback: (error: any) => <ErrorFallback error={error} />,
});

export default TaskManagement;
