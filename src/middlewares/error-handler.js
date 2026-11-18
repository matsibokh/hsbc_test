import { AppError } from "../utils/errors.js";

export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  if (statusCode >= 500) {
    console.error(err);
  }

  const message =
    err instanceof AppError ? err.message : "Internal server error";
  res.status(statusCode).json({ error: message });
}
