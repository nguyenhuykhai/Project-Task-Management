import LoadingContent from "@/components/common/templates/LoadingContent";
import Permission from "@/components/common/templates/Permission";
import type { IPermission } from "@/types";
import { Suspense } from "react";

export const withLazyLoading = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<LoadingContent />}>
      <Component />
    </Suspense>
  );
};

export const withLazyLoadingPermission = (
  Component: any,
  permissions?: IPermission | IPermission[] | boolean,
) => {
  return (
    <Permission permissions={permissions}>
      <Suspense fallback={<LoadingContent />}>
        <Component />
      </Suspense>
    </Permission>
  );
};
