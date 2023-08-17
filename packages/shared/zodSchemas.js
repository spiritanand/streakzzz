import { z } from "zod";
export const signUpSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .regex(/^(?!.*\s{2,})[a-zA-Z\s]+$/, "Name must contain only letters and spaces, and cannot have two or more consecutive empty spaces"),
    email: z.string().email(),
    password: z
        .string()
        .min(10, "Password must be at least 10 characters long")
        .max(100)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,100}$/, "Password must contain at least one letter, one digit and a special character"),
});
export const loginSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(10, "Password must be at least 10 characters long")
        .max(100)
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{10,100}$/, "Password must contain at least one letter, one digit and a special character"),
});
export const addTodoSchema = z.object({
    content: z.string().min(3, "A TodoType must be at least 3 characters long"),
});
export const toggleTodoSchema = z.object({
    id: z.number().positive().int(),
});
export const editTodoSchema = z.object({
    id: z.number().positive().int(),
    content: z.string().min(3, "A TodoType must be at least 3 characters long"),
});
