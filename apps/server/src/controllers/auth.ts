import { Request, Response } from "express";
// import { signUpSchema } from "shared/schemas";

export const login = (req: Request, res: Response) => {
  // Authentication logic
  res.json({ message: "Login successful" });
};

export const signup = (req: Request, res: Response) => {
  // const body = req.body;

  // const result = signUpSchema.safeParse(body);
  //
  // let zodErrors = {};
  // if (!result.success) {
  //   result.error?.errors.forEach((issue) => {
  //     zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
  //   });
  //   return res.status(400).json({ errors: zodErrors, success: false });
  // }

  return res.json({ message: "Signup successful", success: true });
};
