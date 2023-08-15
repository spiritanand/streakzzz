import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { loginSchema, signUpSchema } from "shared/zodSchemas.js";

import { db } from "../db/database.js";
import { users } from "../schema.js";

export const postSignup = async (req: Request, res: Response) => {
  const body = req.body;

  const result = signUpSchema.safeParse(body);

  let zodErrors = {};
  if (!result.success) {
    result.error?.errors.forEach((issue) => {
      zodErrors = {
        ...zodErrors,
        [issue.path[0]]: issue.message,
      };
    });

    res.status(400).json({
      errors: zodErrors,
      success: false,
    });

    return;
  }

  const { email, password } = result.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const returned = await db
      .insert(users)
      .values({ ...body, password: hashedPassword });

    const token = jwt.sign(
      { email, userId: returned[0].insertId },
      "SECRET_KEY",
      {
        expiresIn: "10h",
      },
    );

    // Set the token as a cookie
    res
      .cookie("jwt", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: true,
      })
      .json({
        message: "Signup successful",
        success: true,
      });
  } catch (error) {
    console.log({ error });

    if (error instanceof Error) {
      res.status(409).json({
        errors: error.message,
        success: false,
      });
      return;
    }

    res.status(500).json({
      errors: "Something went wrong",
      success: false,
    });
  }
};

export const postLogin = async (req: Request, res: Response) => {
  const body = req.body;

  const result = loginSchema.safeParse(body);

  let zodErrors = {};
  if (!result.success) {
    result.error?.errors.forEach((issue) => {
      zodErrors = {
        ...zodErrors,
        [issue.path[0]]: issue.message,
      };
    });

    res.status(400).json({
      errors: zodErrors,
      success: false,
    });

    return;
  }

  const { email, password } = result.data;

  try {
    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length === 0) {
      res.status(403).json({
        errors: "Invalid credentials",
        success: false,
      });
      return;
    }

    const match = await bcrypt.compare(password, user[0].password);

    if (!match) {
      res.status(403).json({
        errors: "Invalid credentials",
        success: false,
      });
      return;
    }

    const token = jwt.sign({ email, userId: user[0].id }, "SECRET_KEY", {
      expiresIn: "1h",
    });

    // Set the token as a cookie
    res
      .cookie("jwt", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: true,
      })
      .json({
        message: "Login successful",
        success: true,
      });
  } catch (error) {
    res.status(500).json({
      errors: "Something went wrong",
      success: false,
    });
  }
};

export const postLogout = async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.json({
    message: "Logout successful",
    success: true,
  });
};

export const getMe = async (req: Request, res: Response) => {
  res.json({
    success: true,
  });
};
