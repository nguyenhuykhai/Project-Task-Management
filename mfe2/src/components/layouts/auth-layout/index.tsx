// import useAuthStore from "@/stores/authStore";
// import { getMeAPI } from "@/utils/api/auth";
// import { QUERY_KEYS } from "@/utils/constants/query-keys";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect, type ReactNode } from "react";
// import { Outlet } from "react-router";
// import PermissionDenied from "../common/PermissionDenied";
// import LoadingSpinner from "../common/LoadingSpinner";

// const AuthLayout = ({ children }: { children?: ReactNode }) => {
//   const setUser = useAuthStore((state) => state.setUser);
//   const user = useAuthStore((state) => state.user);

//   const { data, isLoading } = useQuery({
//     queryKey: [QUERY_KEYS.AUTH.GET_ME],
//     queryFn: () => getMeAPI(),
//     gcTime: Infinity,
//     staleTime: 0,
//   });

//   useEffect(() => {
//     setUser(data?.data?.data);
//   }, [data, setUser]);

//   if (isLoading && !user) {
//     return <LoadingSpinner />;
//   }

//   if (!data && !user) {
//     return <PermissionDenied />;
//   }

//   return children ? <>{children}</> : <Outlet />;
// };

// export default AuthLayout;
