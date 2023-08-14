import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signUpSchema, TSignUpSchema } from "shared/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import signupImage from "../../assets/signup.avif";
import useAuth from "../../hooks/useAuth.ts";
import { queryClient } from "../../main.tsx";
import Input from "../../Components/UI/Input.tsx";
import PasswordInput from "../../Components/UI/PasswordInput.tsx";
import Button from "../../Components/UI/Button.tsx";

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

      const data = response.data;

      if (data.success) {
        toast.success("Signed Up 🚀");
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
          setError(key as keyof TSignUpSchema, { message: value });
      }
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
        <Button isSubmitting={isSubmitting} className="md:w-1/2" />
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
