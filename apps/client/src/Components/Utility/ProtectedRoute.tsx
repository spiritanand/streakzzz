import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth.ts";
import AddTodo from "../Todos/AddTodo.tsx";

function ProtectedRoute() {
  const { data } = useAuth();

  return data?.data.success ? (
    <>
      <Outlet />
      <AddTodo />
    </>
  ) : (
    <Navigate to="/login" replace={true} />
  );
}

export default ProtectedRoute;
