import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import cron from "node-cron";

import streak from "./cron/streak.js";
import { jwtVerify } from "./middlewares/jwtVerify.js";
import auth from "./routes/auth.js";
import todos from "./routes/todos.js";

const app = express();

const port = process.env.PORT || 8080;

// to allow cross-origin requests from the client
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// to parse json body
app.use(express.json());
app.use(cookieParser());

app.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);

  // Run streak cron job every day at 00:00 @ IST
  cron.schedule("0 0 * * *", streak, { timezone: "Asia/Kolkata" });
});

// routes
app.use("/auth", auth);
app.use(jwtVerify, todos);
