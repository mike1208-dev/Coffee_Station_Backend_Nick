import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError, NotFoundError } from "./app-error.js";

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new NotFoundError("Route"));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message } });
    return;
  }

  const clientStatus = getClientErrorStatus(err);
  if (clientStatus !== undefined) {
    res.status(clientStatus).json({ error: { message: "Invalid request" } });
    return;
  }

  console.error(err);
  res.status(500).json({ error: { message: "Internal server error" } });
};

function getClientErrorStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null && "status" in err) {
    const status = err.status;
    if (typeof status === "number" && status >= 400 && status < 500) {
      return status;
    }
  }
  return undefined;
}
