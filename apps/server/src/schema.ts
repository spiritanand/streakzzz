import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

// declaring enum in database
export const countries = mysqlTable("countries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
});
