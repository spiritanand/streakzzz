import { z } from "zod";

export enum TodoTypes {
  TODO = "todo",
  STREAK = "streak",
}

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
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^_]).{10,100}$/,
      "Password must contain at least one letter, one digit and a special character",
    ),
});
export type TSignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = signUpSchema.omit({ name: true });
export type TLoginSchema = z.infer<typeof loginSchema>;

export const addTodoSchema = z.object({
  content: z
    .string()
    .min(3, "A Todo must be at least 3 characters long")
    .refine((str) => str.trim().length > 2, "Remove redundant spaces"),
  type: z.nativeEnum(TodoTypes).optional().default(TodoTypes.TODO),
});
export type TAddTodoSchema = z.infer<typeof addTodoSchema>;

export const toggleTodoSchema = z.object({
  id: z.number().positive().int(),
});
export type TToggleTodoSchema = z.infer<typeof toggleTodoSchema>;

export const editTodoSchema = addTodoSchema.merge(toggleTodoSchema);
export type TEditTodoSchema = z.infer<typeof editTodoSchema>;
