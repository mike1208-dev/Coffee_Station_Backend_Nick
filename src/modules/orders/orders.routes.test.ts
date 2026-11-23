import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { prisma } from "../../config/prisma.js";

describe("POST /api/orders", () => {
  it("creates an order using the real database price, not a client price", async () => {
    const product = await prisma.product.findFirstOrThrow();

    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Jane Doe",
        phone: "555-1234",
        items: [{ productId: product.id, quantity: 2 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.customerName).toBe("Jane Doe");
    expect(typeof res.body.totalPrice).toBe("number");
    expect(res.body.totalPrice).toBeCloseTo(product.price.toNumber() * 2);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].productId).toBe(product.id);
    expect(res.body.items[0].unitPrice).toBe(product.price.toNumber());
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({ phone: "555-1234", items: [] });

    expect(res.status).toBe(400);
  });

  it("returns 400 for an unknown field", async () => {
    const product = await prisma.product.findFirstOrThrow();

    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Jane Doe",
        phone: "555-1234",
        items: [{ productId: product.id, quantity: 1 }],
        discountCode: "SAVE10",
      });

    expect(res.status).toBe(400);
  });

  it("returns 400 for an unknown product", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        customerName: "Jane Doe",
        phone: "555-1234",
        items: [{ productId: "does-not-exist", quantity: 1 }],
      });

    expect(res.status).toBe(400);
  });
});
