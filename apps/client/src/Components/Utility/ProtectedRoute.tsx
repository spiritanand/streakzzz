import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth.ts";

function ProtectedRoute() {
  const { data } = useAuth();

  return data?.data.success ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace={true} />
  );
}

export default ProtectedRoute;
