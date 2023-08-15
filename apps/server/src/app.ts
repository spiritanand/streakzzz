import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { jwtVerify } from "./middlewares/jwtVerify.js";
import auth from "./routes/auth.js";
import todos from "./routes/todos.js";

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

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Hello from Express server!");
});

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/auth", auth);
app.use(jwtVerify, todos);
