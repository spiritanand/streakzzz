import { and, eq } from "drizzle-orm";

import { db } from "../db/database.js";
import { todos } from "../schema.js";

export async function userTodo(todoId: number, userId: string) {
  return db
    .select()
    .from(todos)
    .where(and(eq(todos.id, todoId), eq(todos.userId, +userId)));
}
