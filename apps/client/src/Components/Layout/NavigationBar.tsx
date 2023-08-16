import axios, { isAxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import "./NavigationBar.css";
import useAuth from "../../hooks/useAuth.ts";
import { queryClient } from "../../main.tsx";
import Button from "../UI/Button.tsx";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { data } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");

      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Logged Out");

      navigate("/");
    } catch (errors) {
      if (!isAxiosError(errors)) throw errors;

      if (typeof errors.response?.data.errors === "string")
        toast.error(errors.response?.data.errors);
    }
  };

  return (
    <header className="flex flex-row-reverse items-center justify-between p-4 sm:flex-row sm:p-6">
      <Link to="/">
        <h1 className="text-2xl font-extrabold text-red-600 sm:text-3xl">
          STREAKZZZ
        </h1>
      </Link>

      <button
        className={`menu ${isOpen ? "opened" : ""} ml-4 sm:hidden`}
        aria-label="Main Menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg width="50" height="50" viewBox="0 0 100 100">
          <path
            className="line line1"
            d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
          />
          <path className="line line2" d="M 20,50 H 80" />
          <path
            className="line line3"
            d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
          />
        </svg>
      </button>

      <nav
        className={`${
          isOpen ? "top-16" : "-top-full"
        } absolute left-0 z-10 bg-gray-900 p-4 font-bold transition-all duration-500 ease-in-out sm:static`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ul className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-4">
          {/* Show sign up and postLogin button only if user is not authenticated */}
          {!data?.data.success ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/todos">Todos</Link>
              </li>
              <li>
                <Link
                  to="/streakz"
                  className="rounded-2xl bg-red-600 bg-gradient-to-r from-red-600 to-red-500 p-3 hover:bg-gradient-to-l"
                >
                  Streak
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default NavigationBar;
