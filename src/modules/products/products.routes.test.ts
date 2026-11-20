import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app.js";

describe("GET /api/products", () => {
  it("returns all products", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("returns only products in the given category", async () => {
    const res = await request(app).get("/api/products?category=Coffee");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    for (const product of res.body) {
      expect(product.category).toBe("Coffee");
    }
  });

  it("returns 400 for an invalid category", async () => {
    const res = await request(app).get("/api/products?category=NotARealCategory");

    expect(res.status).toBe(400);
  });
});
