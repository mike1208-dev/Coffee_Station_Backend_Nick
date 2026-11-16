import express from "express";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../app.js";
import { AppError } from "./app-error.js";
import { errorHandler, notFoundHandler } from "./error-handler.js";

function createTestApp() {
  const testApp = express();

  testApp.get("/app-error", () => {
    throw new AppError(409, "Already exists");
  });
  testApp.get("/crash", () => {
    throw new Error("secret database detail");
  });
  testApp.get("/async-crash", async () => {
    throw new Error("secret async detail");
  });

  testApp.use(notFoundHandler);
  testApp.use(errorHandler);
  return testApp;
}

describe("error handling", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 404 in the shared shape for an unknown route", async () => {
    const res = await request(app).get("/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { message: "Route not found" } });
  });

  it("uses the status and message of an AppError", async () => {
    const res = await request(createTestApp()).get("/app-error");

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: { message: "Already exists" } });
  });

  it("returns 500 without internal details for an unexpected error", async () => {
    const logSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(createTestApp()).get("/crash");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: { message: "Internal server error" } });
    expect(logSpy).toHaveBeenCalledOnce();
  });

  it("also handles errors thrown in async handlers", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(createTestApp()).get("/async-crash");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: { message: "Internal server error" } });
  });

  it("returns 400 in the shared shape for broken JSON", async () => {
    const res = await request(app)
      .post("/health")
      .set("Content-Type", "application/json")
      .send("{bad json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: { message: "Invalid request" } });
  });

  it("returns 413 when the body is too large", async () => {
    const res = await request(app)
      .post("/health")
      .send({ data: "x".repeat(200_000) });

    expect(res.status).toBe(413);
    expect(res.body).toEqual({ error: { message: "Request body too large" } });
  });

  it("returns 415 for an unsupported charset", async () => {
    const res = await request(app)
      .post("/health")
      .set("Content-Type", "application/json; charset=iso-8859-1")
      .send("{}");

    expect(res.status).toBe(415);
    expect(res.body).toEqual({
      error: { message: "Unsupported content type" },
    });
  });
});
