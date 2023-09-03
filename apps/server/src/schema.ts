import { InferModel, relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { TodoTypes } from "shared/zodSchemas.js";

// Tables
export const streakzzzUsers = mysqlTable("streakzzzUsers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull(),
});

export const streakzzzTodos = mysqlTable("streakzzzTodos", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  done: boolean("done").default(false).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: int("user_id").notNull(),
  type: text("type").default(TodoTypes.TODO).notNull(),
  streak: int("streak").default(0).notNull(),
});

// Types
export type User = InferModel<typeof streakzzzUsers>;
export type Todo = InferModel<typeof streakzzzTodos>;

// Relations
export const usersRelations = relations(streakzzzUsers, ({ many }) => ({
  todos: many(streakzzzTodos),
}));

export const todosRelations = relations(streakzzzTodos, ({ one }) => ({
  user: one(streakzzzUsers, {
    fields: [streakzzzTodos.userId],
    references: [streakzzzUsers.id],
  }),
}));
