import express from "express";
// import { drizzle } from "drizzle-orm/mysql2";
// import { migrate } from "drizzle-orm/mysql2/migrator";
import auth from "./routes/auth";
// import { connection } from "./db/database.js";

const app = express();

const port = process.env.PORT || 8080;

app.get("/", (_req, res) => {
  res.send("Hello from Express server!");
});
app.use("/auth", auth);

app.listen(port, () => {
  // const db = drizzle(connection);
  // await migrate(db, { migrationsFolder: "drizzle" });

  console.log(`Server is running on port ${port}`);
});
