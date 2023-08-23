import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "../schema.js";

dotenv.config();

const poolConnection = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

const db = drizzle(poolConnection, { schema, mode: "default" });

export { db };
