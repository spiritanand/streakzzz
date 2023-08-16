import { ReactNode } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type InputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  fieldName: string;
  label?: string;
  placeholder: string;
  type?: string;
  className?: string;
};

function Input<T extends FieldValues>({
  register,
  errors,
  fieldName,
  label = "",
  placeholder,
  type = "text",
}: InputProps<T>) {
  return (
    <label
      htmlFor={fieldName}
      className="flex flex-col gap-1 md:w-1/2 md:gap-2"
    >
      <p>{label}</p>
      <input
        {...register(fieldName as Path<T>)}
        placeholder={placeholder}
        id={fieldName}
        type={type}
        className="rounded border-none bg-transparent p-2 outline-none focus:bg-gray-800"
      />
      {errors[fieldName] ? (
        <span className="text-amber-400">
          {errors[fieldName]?.message as ReactNode}
        </span>
      ) : (
        ""
      )}
    </label>
  );
}

export default Input;
