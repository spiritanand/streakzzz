import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { TodoTypes } from "shared/types.js";
import {
  addTodoSchema,
  editTodoSchema,
  toggleTodoSchema,
} from "shared/zodSchemas.js";

import { db } from "../db/database.js";
import { todos, users } from "../schema.js";

export const getTodos = async (req: Request, res: Response) => {
  const userId = req.headers.userId;
  const params = req.params;

  const type = params.type;

  if (type !== TodoTypes.TODO && type !== TodoTypes.STREAK) {
    res.status(400).json({
      errors: "Invalid type",
      success: false,
    });
    return;
  }

  try {
    if (typeof userId === "string") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const userTodos = await db.query.users.findFirst({
        where: eq(users.id, +userId),
        with: {
          todos: {
            where: (todoItem) => eq(todoItem.type, type),
          },
        },
      });

      res.json({
        todos: userTodos?.todos,
        success: true,
      });
      return;
    }

    res.status(500).json({
      errors: "Invalid User ID",
      success: false,
    });
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

  const { content, type } = result.data;

  try {
    if (typeof userId === "string") {
      await db.insert(todos).values({
        content: content.trim(),
        type,
        userId: +userId,
      });

      res.json({
        success: true,
        message: "Todo added",
      });
    }
  } catch (e) {
    res.status(500).json({
      errors: "Something went wrong",
      success: false,
    });
  }
};

export const postToggleTodo = async (req: Request, res: Response) => {
  const userId = req.headers.userId;

  const body = req.body;

  const result = toggleTodoSchema.safeParse(body);

  if (!result.success) {
    res.status(400).json({
      errors: result.error?.errors[0].message,
      success: false,
    });

    return;
  }

  const { id: todoId } = result.data;

  try {
    if (typeof userId === "string") {
      const returned = await db
        .select()
        .from(todos)
        .where(and(eq(todos.id, todoId), eq(todos.userId, +userId)));

      if (returned.length === 0) {
        res.status(404).json({
          errors: "Todo not found",
          success: false,
        });

        return;
      }

      await db
        .update(todos)
        .set({ done: !returned[0].done })
        .where(and(eq(todos.id, todoId), eq(todos.userId, +userId)));

      res.json({
        success: true,
        message: "Updated",
      });
    }
  } catch (e) {
    res.status(500).json({
      errors: "Something went wrong",
      success: false,
    });
  }
};

export const postEditTodo = async (req: Request, res: Response) => {
  const userId = req.headers.userId;

  const body = req.body;

  const result = editTodoSchema.safeParse(body);

  if (!result.success) {
    res.status(400).json({
      errors: "Invalid content",
      success: false,
    });

    return;
  }

  const { id: todoId, content } = result.data;

  try {
    if (typeof userId === "string") {
      const returned = await db
        .select()
        .from(todos)
        .where(and(eq(todos.id, todoId), eq(todos.userId, +userId)));

      if (returned.length === 0) {
        res.status(404).json({
          errors: "Not found",
          success: false,
        });

        return;
      }

      await db
        .update(todos)
        .set({ content: content.trim() })
        .where(and(eq(todos.id, todoId), eq(todos.userId, +userId)));

      res.json({
        success: true,
        message: "Updated",
      });
    }
  } catch (e) {
    res.status(500).json({
      errors: "Something went wrong",
      success: false,
    });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const userId = req.headers.userId;

  const params = req.params;

  const todoId = params.id;

  try {
    if (typeof userId === "string" && typeof todoId === "string") {
      const returned = await db
        .select()
        .from(todos)
        .where(and(eq(todos.id, +todoId), eq(todos.userId, +userId)));

      if (returned.length === 0) {
        res.status(404).json({
          errors: "Not found",
          success: false,
        });

        return;
      }

      await db
        .delete(todos)
        .where(and(eq(todos.id, +todoId), eq(todos.userId, +userId)));

      res.json({
        success: true,
        message: "Deleted",
      });
    }
  } catch (e) {
    res.status(500).json({
      errors: "Something went wrong",
      success: false,
    });
  }
};
