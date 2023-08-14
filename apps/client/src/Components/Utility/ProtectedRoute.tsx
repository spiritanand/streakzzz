import { Outlet } from "react-router-dom";

function ProtectedRoute() {
  // const { data } = useAuth();

  // return data?.data.success ? (
  return <Outlet />;
  // ) : (
  //   <Navigate to="/login" replace={true} />
  // );
}

export default ProtectedRoute;
