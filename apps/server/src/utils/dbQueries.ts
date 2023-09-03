import { and, eq } from "drizzle-orm";

import { db } from "../db/database.js";
import { streakzzzTodos } from "../schema.js";

export async function userTodo(todoId: number, userId: string) {
  return db
    .select()
    .from(streakzzzTodos)
    .where(
      and(eq(streakzzzTodos.id, todoId), eq(streakzzzTodos.userId, +userId)),
    );
}
