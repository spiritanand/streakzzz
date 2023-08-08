import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Components/Root.tsx";
import Login from "./Pages/Auth/Login.tsx";
import SignUp from "./Pages/Auth/SignUp.tsx";
import Home from "./Pages/Home.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <h1>404</h1>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
    ],
  },
  { path: "/signup", element: <SignUp /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
