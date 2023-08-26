import { eq } from "drizzle-orm";
import { TodoTypes } from "shared/zodSchemas.js";

import { db } from "../db/database.js";
import { todos } from "../schema.js";

const streak = async () => {
  try {
    // Fetch all todos of type "streak"
    const streakTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.type, TodoTypes.STREAK));

    // Prepare an array of promises for updates
    const updatePromises = streakTodos.map(async (streakTodo) => {
      if (!streakTodo.done) {
        // If not done, reset streak to 0
        return db
          .update(todos)
          .set({
            streak: 0,
          })
          .where(eq(todos.id, streakTodo.id));
      }

      // If done, reset "done" status
      return db
        .update(todos)
        .set({ streak: streakTodo.streak + 1, done: false })
        .where(eq(todos.id, streakTodo.id));
    });

    // Execute all update promises concurrently
    await Promise.all(updatePromises);

    console.log("Streakzzz checked and updated.");
  } catch (error) {
    console.error("Error checking and updating streak todos:", error);
  }
};

export default streak;
