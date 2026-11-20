import express from "express";

export const router = express.Router();

router.get("/unknown", (__req, res) => {
  res.status(404).json({ error: { message: "Route not found" } });
});
