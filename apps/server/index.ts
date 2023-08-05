import express from "express";
import { logger } from "shared/types";

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (_req, res) => {
  res.send("Hello from Express server!");
});

app.listen(port, () => {
  logger("this is sparta");
  console.log(`Server is running on port ${port}`);
});
