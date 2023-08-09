import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  email: z.string().email(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long")
    .max(100)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].{10,100}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit and a special character",
    ),
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;
