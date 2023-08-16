import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "../schema.js";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "adminroot",
  database: "streakzzz",
});

const db = drizzle(connection, { schema, mode: "default" });

export { db };
