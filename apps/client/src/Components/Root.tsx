import { Outlet } from "react-router-dom";

import Footer from "./Layout/Footer.tsx";
import NavigationBar from "./Layout/NavigationBar.tsx";
import Loading from "../Pages/Loading/Loading.tsx";
import useAuth from "../hooks/useAuth.ts";

const Root = () => {
  const { isLoading, isFetched } = useAuth();

  if (isLoading && !isFetched) return <Loading className="h-screen" />;

  return (
    <>
      <NavigationBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Root;
