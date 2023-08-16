import axios from "axios";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Root from "./Components/Root.tsx";
import ProtectedRoute from "./Components/Utility/ProtectedRoute.tsx";
import Login from "./Pages/Auth/Login.tsx";
import SignUp from "./Pages/Auth/SignUp.tsx";
import Home from "./Pages/Home.tsx";
import Todos from "./Pages/Todos/Todos.tsx";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8080";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<div>404</div>}>
      <Route index={true} element={<Home />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="todos" element={<Todos />} />
        <Route path="streakz" element={<div>Coming Soon</div>} />
      </Route>
    </Route>,
  ),
);

function App() {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={true} />
      <Toaster position="bottom-center" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
