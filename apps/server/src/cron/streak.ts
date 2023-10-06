import { eq } from "drizzle-orm";
import { TodoTypes } from "shared/zodSchemas.js";

import { db } from "../db/database.js";
import { streakzzzTodos } from "../schema.js";

const streak = async () => {
  try {
    // Fetch all streakzzzTodos of type "streak"
    const streakTodos = await db
      .select()
      .from(streakzzzTodos)
      .where(eq(streakzzzTodos.type, TodoTypes.STREAK));

    // Prepare an array of promises for updates
    const updatePromises = streakTodos.map(async (streakTodo) => {
      if (!streakTodo.done) {
        // If not done, reset streak to 0
        return db
          .update(streakzzzTodos)
          .set({
            streak: 0,
          })
          .where(eq(streakzzzTodos.id, streakTodo.id));
      }

      // If done, reset "done" status
      return db
        .update(streakzzzTodos)
        .set({ done: false })
        .where(eq(streakzzzTodos.id, streakTodo.id));
    });

    // Execute all update promises concurrently
    await Promise.all(updatePromises);
  } catch (error) {
    /* empty */
  }
};

export default streak;
