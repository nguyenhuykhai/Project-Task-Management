import Detail from "@/pages/Detail";
import Home from "@/pages/Home";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { withLazyLoading } from "../router-helper";

const AppLayout = lazy(() => import("@/components/layouts/app-layout"));
const NotFound = lazy(() => import("@/components/common/templates/NotFound"));
const NotHavePermission = lazy(
  () => import("@/components/common/templates/NotHavePermission")
);

const MainAppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={withLazyLoading(AppLayout)}>
          <Route index element={withLazyLoading(Home)} />
          <Route path="detail" element={withLazyLoading(Detail)} />
          <Route
            path="not-have-permission"
            element={withLazyLoading(NotHavePermission)}
          />
          <Route path="*" element={withLazyLoading(NotFound)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainAppRoutes;
