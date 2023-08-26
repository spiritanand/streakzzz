import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import {
  TodoTypes,
  addTodoSchema,
  editTodoSchema,
  toggleTodoSchema,
} from "shared/zodSchemas.js";

import { db } from "../db/database.js";
import { todos, users } from "../schema.js";
import { userTodo } from "../utils/dbQueries.js";
import {
  sendError,
  sendNotFound,
  sendSomethingWentWrong,
} from "../utils/responses.js";

export const getTodos = async (req: Request, res: Response) => {
  const userId = req.headers.userId;
  const params = req.params;

  const type = params.type;

  if (type !== TodoTypes.TODO && type !== TodoTypes.STREAK) {
    sendError(res, "Invalid type");

    return;
  }

  try {
    if (typeof userId === "string") {
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
    sendSomethingWentWrong(res);
  }
};

export const postAddTodo = async (req: Request, res: Response) => {
  const userId = req.headers.userId;
  const body = req.body;

  const result = addTodoSchema.safeParse(body);

  if (!result.success) {
    sendError(res, result.error?.errors[0].message);

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
    sendSomethingWentWrong(res);
  }
};

export const postToggleTodo = async (req: Request, res: Response) => {
  const userId = req.headers.userId;

  const body = req.body;

  const result = toggleTodoSchema.safeParse(body);

  if (!result.success) {
    sendError(res, result.error?.errors[0].message);

    return;
  }

  const { id: todoId } = result.data;

  try {
    if (typeof userId === "string") {
      const returned = await userTodo(todoId, userId);

      if (returned.length === 0) {
        res.status(404).json({
          errors: "Todo not found",
          success: false,
        });

        return;
      }

      let streak = 0;
      if (returned[0].type === TodoTypes.STREAK) {
        if (returned[0].done) streak = returned[0].streak - 1;
        else streak = returned[0].streak + 1;
      }

      await db
        .update(todos)
        .set({ done: !returned[0].done, streak })
        .where(and(eq(todos.id, todoId), eq(todos.userId, +userId)));

      res.json({
        success: true,
        message: "Updated",
      });
    }
  } catch (e) {
    sendSomethingWentWrong(res);
  }
};

export const postEditTodo = async (req: Request, res: Response) => {
  const userId = req.headers.userId;

  const body = req.body;

  const result = editTodoSchema.safeParse(body);

  if (!result.success) {
    sendError(res, "Invalid content");

    return;
  }

  const { id: todoId, content } = result.data;

  try {
    if (typeof userId === "string") {
      const returned = await userTodo(todoId, userId);

      if (returned.length === 0) {
        sendNotFound(res);

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
    sendSomethingWentWrong(res);
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const userId = req.headers.userId;

  const params = req.params;

  const todoId = params.id;

  try {
    if (typeof userId === "string" && typeof todoId === "string") {
      const returned = await userTodo(+todoId, userId);

      if (returned.length === 0) {
        sendNotFound(res);

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
    sendSomethingWentWrong(res);
  }
};
