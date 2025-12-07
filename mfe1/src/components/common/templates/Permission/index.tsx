import React from "react";
import { Outlet } from "react-router";
import { checkPermissions } from "@/lib/function";
import type { IPermission } from "@/types";
import NotHavePermission from "../NotHavePermission";

const Permission = ({
  permissions,
  children,
}: {
  permissions?: IPermission | IPermission[] | boolean;
  children?: React.ReactNode;
}) => {
  if (typeof permissions === "boolean") {
    if (permissions) return children || <Outlet />;
    return <NotHavePermission />;
  }

  const check = checkPermissions(permissions || false);

  if (!check) {
    return <NotHavePermission />;
  }
  return children || <Outlet />;
};

export default Permission;
