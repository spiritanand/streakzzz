import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/database.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";

const { verify } = jwt;

export const jwtVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwt = req.cookies.jwt;

  try {
    const decoded = verify(jwt, "SECRET_KEY");

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
    res.clearCookie("jwt").status(403).json({
      errors: "Invalid token",
      success: false,
    });
  }
};
