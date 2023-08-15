import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { todos, users } from "../schema.js";
import { db } from "../db/database.js";
import { addTodoSchema } from "shared/zodSchemas.js";

export const getTodos = async (req: Request, res: Response) => {
  const userId = req.headers.userId;

  try {
    if (typeof userId === "string") {
      const userTodos = await db.query.users.findFirst({
        where: eq(users.id, +userId),
        with: {
          todos: true,
        },
      });

      res.json({
        todos: userTodos?.todos,
        success: true,
      });
    }
  } catch (e) {
    res.status(500).json({
      errors: "Something went wrong",
      success: false,
    });
  }
};

export const postAddTodo = async (req: Request, res: Response) => {
  const userId = req.headers.userId;
  const body = req.body;

  const result = addTodoSchema.safeParse(body);

  if (!result.success) {
    res.status(400).json({
      errors: result.error?.errors[0].message,
      success: false,
    });

    return;
  }

  try {
    if (typeof userId === "string") {
      await db.insert(todos).values({ content: body.content, userId: +userId });

      res.json({
        success: true,
        message: "Todo added",
      });

      return;
    }
  } catch (e) {
    res.status(500).json({
      errors: "Something went wrong",
      success: false,
    });
  }
};
