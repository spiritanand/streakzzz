import { Response } from "express";
import { SafeParseError } from "zod";

import { sendError } from "./responses.js";

export default function handleZodError<T>(
  result: SafeParseError<T>,
  res: Response,
) {
  let zodErrors = {};
  result.error?.errors.forEach((issue) => {
    zodErrors = {
      ...zodErrors,
      [issue.path[0]]: issue.message,
    };
  });

  sendError(res, zodErrors);
}
