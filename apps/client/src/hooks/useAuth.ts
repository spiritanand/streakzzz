import axios, { isAxiosError } from "axios";
import { Path, SubmitHandler, UseFormSetError } from "react-hook-form";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { TLoginSchema, TSignUpSchema } from "shared/zodSchemas.ts";

import { queryClient } from "../main.tsx";

const fetchAuthState = async () => {
  try {
    return await axios.get("/auth/me");
  } catch (e) {
    if (e instanceof Error)
      return { data: { success: false, message: e.message } };

    return { data: { success: false, message: "Something went wrong" } };
  }
};

const useAuth = () => {
  return useQuery(["auth"], fetchAuthState, {
    retry: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAuthSubmit = <T extends TLoginSchema | TSignUpSchema>(
  endpoint: "/auth/login" | "/auth/signup",
  setError: UseFormSetError<T>,
) => {
  const isLogin = endpoint === "/auth/login";

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<T> = async (input) => {
    try {
      const response = await axios.post(endpoint, JSON.stringify(input), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = response.data;

      if (res.success) {
        toast.success(`${isLogin ? "Login" : "Signup"} successful 🚀`);
        await queryClient.invalidateQueries({ queryKey: ["auth"] });
        navigate("/todos");
      } else {
        toast.error("Something went wrong");
      }
    } catch (e) {
      if (!isAxiosError(e)) {
        // eslint-disable-next-line no-console
        console.log(e);

        return;
      }

      if (typeof e.response?.data.errors === "string")
        toast.error(e.response?.data.errors);

      const errorData = e.response?.data.errors;
      Object.keys(errorData).forEach((key) => {
        const value = errorData[key];
        if (typeof value === "string") {
          setError(key as Path<T>, { message: value });
        }
      });
    }
  };

  return onSubmit;
};

export default useAuth;
