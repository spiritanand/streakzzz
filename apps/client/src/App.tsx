import axios from "axios";
import { Toaster } from "react-hot-toast";
// import { ReactQueryDevtools } from "react-query/devtools";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { TodoTypes } from "shared/zodSchemas.ts";

import Root from "./Components/Root.tsx";
import ProtectedRoute from "./Components/Utility/ProtectedRoute.tsx";
import Login from "./Pages/Auth/Login.tsx";
import SignUp from "./Pages/Auth/SignUp.tsx";
import Home from "./Pages/Home.tsx";
import TodosList from "./Pages/TodosList.tsx";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<div>404</div>}>
      <Route index={true} element={<Home />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="todos" element={<TodosList queryKey={TodoTypes.TODO} />} />
        <Route
          path="streakz"
          element={<TodosList queryKey={TodoTypes.STREAK} />}
        />
      </Route>
    </Route>,
  ),
);

function App() {
  return (
    <>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      <Toaster position="bottom-center" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
