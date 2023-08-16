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

// Tables
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull(),
});

export const todos = mysqlTable("todos", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  done: boolean("done").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
  userId: int("user_id").notNull(),
});

// Types
export type User = InferModel<typeof users>;
export type Todo = InferModel<typeof todos>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}));
