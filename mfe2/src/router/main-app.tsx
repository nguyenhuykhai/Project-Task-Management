// import { lazy } from "react";
// import { Route, Routes } from "react-router";
// import { withLazyLoading, withLazyLoadingPermission } from "./router-helper";
// import type { IPermission } from "@/types";

// const App = lazy(() => import("@/App"));
// const NotFound = lazy(() => import("@/components/common/templates/NotFound"));
// const NotHavePermission = lazy(
//   () => import("@/components/common/templates/NotHavePermission")
// );

// export const MainApp = () => {
//   const subApps: {
//     key: string;
//     path: string;
//     component: any;
//     permission?: IPermission | IPermission[] | boolean;
//   }[] = [
//     {
//       key: "task-management",
//       path: "task-management/*",
//       component: TaskManagement,
//       permission: true,
//     },
//   ];

//   const microAppRoutes = [
//     ...subApps.map((subApp) => (
//       <Route
//         key={subApp.key}
//         path={subApp.path}
//         element={withLazyLoadingPermission(subApp.component, subApp.permission)}
//       />
//     )),
//   ];

//   return (
//     <Routes>
//       <Route path="/" element={withLazyLoading(AuthLayout)}>
//         <Route index element={withLazyLoading(App)} />
//         {microAppRoutes}
//         <Route
//           path="not-have-permission"
//           element={withLazyLoading(NotHavePermission)}
//         />
//         <Route path="*" element={withLazyLoading(NotFound)} />
//       </Route>
//     </Routes>
//   );
// };
