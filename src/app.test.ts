import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "./app.js";
import { prisma } from "./config/prisma.js";

describe("GET /health", () => {
  it("returns 200 and status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("GET /images/:file", () => {
  it("returns an existing image", async () => {
    const res = await request(app).get("/images/coffee-1.avif");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/avif");
  });

  it("returns 404 for a missing image", async () => {
    const res = await request(app).get("/images/does-not-exist.avif");

    expect(res.status).toBe(404);
  });

  it("serves the image of every product", async () => {
    const products = await prisma.product.findMany();
    expect(products.length).toBeGreaterThan(0);

    for (const product of products) {
      expect(product.imageUrl).toMatch(/^\/images\/[a-z]+-\d+\.avif$/);
      const res = await request(app).get(product.imageUrl);
      expect(res.status, product.imageUrl).toBe(200);
    }
  });
});
