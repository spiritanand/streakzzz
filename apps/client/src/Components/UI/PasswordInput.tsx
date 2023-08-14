import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { ReactNode, useState } from "react";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

function PasswordInput<T extends FieldValues>({ register, errors }: Props<T>) {
  const [isPassword, setIsPassword] = useState(true);

  return (
    <label htmlFor="password" className="flex flex-col gap-1 md:w-1/2 md:gap-2">
      <p>Password</p>
      <input
        {...register("password" as Path<T>)}
        type={isPassword ? "password" : "text"}
        placeholder="Password"
        className="w-full rounded border-none bg-transparent p-2 outline-none focus:bg-gray-800"
      />
      <label className="mt-0.5 flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-indigo-600"
          onChange={() => setIsPassword(!isPassword)}
        />
        <span className="ml-2 text-sm">Show password</span>
      </label>
      {errors.password ? (
        <span className="text-amber-400">
          {errors.password.message as ReactNode}
        </span>
      ) : (
        ""
      )}
    </label>
  );
}

export default PasswordInput;
