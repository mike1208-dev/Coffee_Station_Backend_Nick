import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("GET /api/unknown", () => {
  it("returns 404 in the shared error shape", async () => {
    const res = await request(app).get("/api/unknown");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { message: "Route not found" } });
  });
});
