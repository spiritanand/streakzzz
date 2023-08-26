import { Response } from "express";

export function sendSomethingWentWrong(res: Response) {
  res.status(500).json({
    errors: "Something went wrong",
    success: false,
  });
}

export function sendError(res: Response, message: string | object) {
  res.status(400).json({
    errors: message,
    success: false,
  });
}

export function sendNotFound(res: Response) {
  res.status(404).json({
    errors: "Not found",
    success: false,
  });
}
