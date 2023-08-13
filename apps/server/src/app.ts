import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { migrate } from "drizzle-orm/mysql2/migrator";

import auth from "./routes/auth.js";
import { db } from "./db/database.js";

const app = express();

const port = process.env.PORT || 8080;

// Apply CORS middleware only to specific routes
// const allowedOrigins = ["http://localhost:5173"];
// const corsOptions = {
//   origin: (
//     origin: string | undefined,
//     callback: (error: Error | null, allow?: boolean) => void,
//   ) => {
//     if (allowedOrigins.includes(<string>origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cors());

app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Hello from Express server!");
});

app.listen(port, async () => {
  await migrate(db, { migrationsFolder: "drizzle" });

  console.log(`Server is running on port ${port}`);
});

app.use("/auth", auth);
