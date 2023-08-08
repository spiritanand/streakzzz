import { Outlet } from "react-router-dom";
import NavigationBar from "./Layout/NavigationBar.tsx";

const Root = () => {
  return (
    <>
      <NavigationBar />
      <Outlet />
    </>
  );
};

export default Root;
