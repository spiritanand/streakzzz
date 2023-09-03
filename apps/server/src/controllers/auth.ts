import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema, signUpSchema } from "shared/zodSchemas.js";

import { db } from "../db/database.js";
import { streakzzzUsers } from "../schema.js";
import handleZodError from "../utils/handleZodErrors.js";
import { sendSomethingWentWrong } from "../utils/responses.js";

const prodEnv = process.env.NODE_ENV === "production";

export const postSignup = async (req: Request, res: Response) => {
  const body = req.body;

  const result = signUpSchema.safeParse(body);

  if (!result.success) {
    handleZodError(result, res);

    return;
  }

  const { email, password } = result.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const returned = await db
      .insert(streakzzzUsers)
      .values({ ...body, password: hashedPassword });

    const token = jwt.sign(
      { email, userId: returned[0].insertId },
      "SECRET_KEY",
      {
        expiresIn: "1h",
      },
    );

    // Set the token as a cookie
    res
      .cookie("jwt", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: prodEnv ? "none" : true,
        secure: prodEnv,
      })
      .json({
        message: "Signup successful",
        success: true,
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(409).json({
        errors: error.message,
        success: false,
      });
      return;
    }

    sendSomethingWentWrong(res);
  }
};

export const postLogin = async (req: Request, res: Response) => {
  const body = req.body;

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    handleZodError(result, res);

    return;
  }

  const { email, password } = result.data;

  try {
    const user = await db
      .select()
      .from(streakzzzUsers)
      .where(eq(streakzzzUsers.email, email));

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
        sameSite: prodEnv ? "none" : true,
        secure: prodEnv,
      })
      .json({
        message: "Login successful",
        success: true,
      });
  } catch (error) {
    sendSomethingWentWrong(res);
  }
};

export const postLogout = async (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    sameSite: prodEnv ? "none" : true,
    secure: prodEnv,
  });
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
