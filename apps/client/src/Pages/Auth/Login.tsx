import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginSchema, TLoginSchema } from "shared/zodSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { queryClient } from "../../main.tsx";
import loginImage from "../../assets/login.avif";

const Login = () => {
  const navigate = useNavigate();

  const { data } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<TLoginSchema> = async (input) => {
    try {
      const response = await axios.post("/auth/login", JSON.stringify(input), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.success) {
        toast.success("Logged In 🚀");
        await queryClient.invalidateQueries({ queryKey: ["auth"] });
        navigate("/todos");
      } else {
        toast.error("Something went wrong");
      }
    } catch (errors) {
      if (!axios.isAxiosError(errors)) throw errors;

      if (typeof errors.response?.data.errors === "string")
        toast.error(errors.response?.data.errors);

      for (const [key, value] of Object.entries(errors.response?.data.errors)) {
        if (typeof value === "string")
          setError(key as keyof TLoginSchema, { message: value });
      }
    }
  };

  if (data?.data.success) return <Navigate to="/todos" replace={true} />;

  return (
    <div className="container m-auto flex min-h-screen flex-col items-center md:flex-row-reverse">
      <div className="w-full bg-red-600 md:w-1/3 md:bg-black">
        <img
          src={loginImage}
          alt="Release the beast"
          className="m-auto h-60 w-full object-cover  p-8 grayscale md:h-screen"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-6 font-serif md:items-center md:gap-10"
        noValidate
      >
        <div className="mt-6 text-center">
          <h1 className="text-4xl font-extrabold text-red-600 sm:text-5xl">
            Login
          </h1>
          <p className="mt-3">
            Release the <span className="font-bold">beast</span>
          </p>
        </div>
        <label
          htmlFor="email"
          className="flex flex-col gap-1 md:w-1/2 md:gap-2"
        >
          <p>Email</p>
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="rounded border-none bg-transparent p-2 outline-none focus:bg-gray-800"
          />
          {errors.email ? (
            <span className="text-amber-400">{errors.email.message}</span>
          ) : (
            ""
          )}
        </label>
        <label
          htmlFor="password"
          className="flex flex-col gap-1 md:w-1/2 md:gap-2"
        >
          <p>Password</p>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="rounded border-none bg-transparent p-2 outline-none focus:bg-gray-800"
          />
          {errors.password ? (
            <span className="text-amber-400">{errors.password.message}</span>
          ) : (
            ""
          )}
        </label>
        <button
          type="submit"
          className="mt-3 cursor-pointer rounded-2xl bg-gradient-to-r from-red-600 to-red-500 p-2 font-bold  uppercase drop-shadow transition hover:scale-105 hover:bg-gradient-to-l focus:outline-white disabled:cursor-not-allowed disabled:opacity-75 md:w-1/2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <svg
              className="m-auto h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-3.647z"
              ></path>
            </svg>
          ) : (
            "Submit"
          )}
        </button>
        <div>
          Not registered?
          <Link
            to="/signup"
            className="ml-3 font-bold text-red-600 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
