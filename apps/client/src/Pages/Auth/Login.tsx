import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginSchema, TLoginSchema } from "shared/zodSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { queryClient } from "../../main.tsx";
import loginImage from "../../assets/login.avif";
import Input from "../../Components/UI/Input.tsx";
import PasswordInput from "../../Components/UI/PasswordInput.tsx";
import Button from "../../Components/UI/Button.tsx";

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
    <div className="container m-auto flex min-h-screen flex-col md:flex-row-reverse md:items-center">
      <div className="w-full bg-red-600 md:w-1/3 md:bg-black">
        <img
          src={loginImage}
          alt="Release the beast"
          className="m-auto h-60 w-full object-cover p-8 grayscale md:h-screen"
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
        <Input
          fieldName="email"
          label="Email"
          placeholder="Email"
          errors={errors}
          register={register}
          type="email"
        />
        <PasswordInput errors={errors} register={register} />
        <Button
          isSubmitting={isSubmitting}
          className="mt-3 md:w-1/2"
          type="submit"
        />
        <div className="text-center">
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
