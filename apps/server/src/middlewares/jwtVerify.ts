import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { db } from "../db/database.js";
import { users } from "../schema.js";

const { verify } = jwt;

const prodEnv = process.env.NODE_ENV === "production";

export const jwtVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.jwt;

  try {
    const decoded = verify(token, "SECRET_KEY");

    if (
      decoded &&
      typeof decoded === "object" &&
      typeof decoded.userId === "number"
    ) {
      const userId = decoded.userId;

      const user = await db.select().from(users).where(eq(users.id, userId));

      if (user.length === 0) {
        throw new Error("No user found");
      }

      req.headers.userId = String(userId);

      next();
    }
  } catch (e) {
    res
      .clearCookie("jwt", {
        sameSite: prodEnv ? "none" : true,
        secure: prodEnv,
      })
      .status(403)
      .json({
        errors: "Invalid token",
        success: false,
      });
  }
};
