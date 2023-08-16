import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { TSignUpSchema, signUpSchema } from "shared/zodSchemas";

import Button from "../../Components/UI/Button.tsx";
import Input from "../../Components/UI/Input.tsx";
import PasswordInput from "../../Components/UI/PasswordInput.tsx";
import signupImage from "../../assets/signup.avif";
import useAuth from "../../hooks/useAuth.ts";
import { queryClient } from "../../main.tsx";

const SignUp = () => {
  const navigate = useNavigate();

  const { data } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<TSignUpSchema> = async (input) => {
    try {
      const response = await axios.post("/auth/signup", JSON.stringify(input), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = response.data;

      if (res.success) {
        toast.success("Signed Up 🚀");
        await queryClient.invalidateQueries({ queryKey: ["auth"] });
        navigate("/todos");
      } else {
        toast.error("Something went wrong");
      }
    } catch (e) {
      if (!isAxiosError(e)) throw e;

      if (typeof e.response?.data.errors === "string")
        toast.error(e.response?.data.errors);

      const errorData = e.response?.data.errors;
      Object.keys(errorData).forEach((key) => {
        const value = errorData[key];
        if (typeof value === "string")
          setError(key as keyof TSignUpSchema, { message: value });
      });
    }
  };

  if (data?.data.success) return <Navigate to="/todos" replace={true} />;

  return (
    <div className="container m-auto flex min-h-screen flex-col md:flex-row md:items-center">
      <div className="w-full bg-red-600 md:w-1/3 md:bg-black">
        <img
          src={signupImage}
          alt="Unleash your potential"
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
            Sign Up
          </h1>
          <p className="mt-3">
            Join StreakZZZ and fulfill your{" "}
            <span className="font-bold">potential</span>
          </p>
        </div>
        <Input
          fieldName="name"
          label="Name"
          placeholder="Name"
          errors={errors}
          register={register}
        />
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
          Already registered?
          <Link
            to="/login"
            className="ml-3 font-bold text-red-600 hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
