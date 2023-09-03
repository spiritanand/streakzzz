import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "../schema.js";

dotenv.config();

const connection = await mysql.createConnection(
  process.env.DATABASE_URL as string,
);

const db = drizzle(connection, { schema, mode: "planetscale" });

export { db };
