import express from "express";
import { fileURLToPath } from "node:url";
import { errorHandler, notFoundHandler } from "./common/error-handler.js";
import { router } from "./routes/index.js";

// Resolved from this file, not the cwd, so it works from both src/ (dev) and dist/ (build).
const imagesDir = fileURLToPath(
  new URL("../public/assets/images", import.meta.url),
);

export const app = express();

app.use(express.json());
app.use("/api", router);
app.use("/images", express.static(imagesDir));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(notFoundHandler);
app.use(errorHandler);
