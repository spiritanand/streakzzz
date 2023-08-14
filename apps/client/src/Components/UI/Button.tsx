import React from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  isSubmitting?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ isSubmitting, children, className }: ButtonProps) {
  return (
    <button
      type="submit"
      className={twMerge(
        "mt-3 cursor-pointer rounded-2xl bg-gradient-to-r from-red-600 to-red-500 p-2 font-bold  uppercase drop-shadow transition hover:scale-105 hover:bg-gradient-to-l focus:outline-white disabled:cursor-not-allowed disabled:opacity-75",
        className,
      )}
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
        <>{children || "Submit"}</>
      )}
    </button>
  );
}

export default Button;
