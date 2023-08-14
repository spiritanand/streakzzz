import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .regex(
      /^(?!.*\s{2,})[a-zA-Z\s]+$/,
      "Name must contain only letters and spaces, and cannot have two or more consecutive empty spaces",
    ),
  email: z.string().email(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long")
    .max(100)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,100}$/,
      "Password must contain at least one letter, one digit and a special character",
    ),
});
export type TSignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long")
    .max(100)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,100}$/,
      "Password must contain at least one letter, one digit and a special character",
    ),
});
export type TLoginSchema = z.infer<typeof loginSchema>;

export const addTodoSchema = z.object({
  todo: z.string().min(3, "A Todo must be at least 3 characters long"),
});
export type TAddTodoSchema = z.infer<typeof addTodoSchema>;
