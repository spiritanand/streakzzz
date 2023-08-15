import { Outlet } from "react-router-dom";
import NavigationBar from "./Layout/NavigationBar.tsx";
import Footer from "./Layout/Footer.tsx";
import useAuth from "../hooks/useAuth.ts";
import Loading from "../Pages/Loading/Loading.tsx";

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
