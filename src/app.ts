import express from "express";
import { errorHandler, notFoundHandler } from "./common/error-handler.js";
import { router } from "./routes/index.js";

export const app = express();

app.use(express.json());
app.use("/api", router);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);
