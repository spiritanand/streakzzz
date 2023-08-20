// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "../schema.js";

dotenv.config();

const connection = await mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQLUSER,
  password: "adminroot",
  database: "streakzzz",
});

const db = drizzle(connection, { schema, mode: "default" });

export { db };
