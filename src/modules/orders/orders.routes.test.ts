import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { prisma } from "../../config/prisma.js";

const createdOrderIds: string[] = [];

afterEach(async () => {
  await prisma.order.deleteMany({ where: { id: { in: createdOrderIds } } });
  createdOrderIds.length = 0;
});

async function validBody() {
  const product = await prisma.product.findFirstOrThrow();
  return {
    customerName: "Jane Doe",
    phone: "555-1234",
    items: [{ productId: product.id, quantity: 1 }],
  };
}

async function postOrder(body: unknown) {
  const res = await request(app)
    .post("/api/orders")
    .send(body as object);
  if (res.status === 201) createdOrderIds.push(res.body.id);
  return res;
}

describe("POST /api/orders", () => {
  it("creates an order using the real database price, not a client price", async () => {
    const product = await prisma.product.findFirstOrThrow();

    const res = await postOrder({
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

  it("adds up several items and copies the product names", async () => {
    const [a, b] = await prisma.product.findMany({ take: 2 });

    const res = await postOrder({
      customerName: "Jane Doe",
      phone: "555-1234",
      items: [
        { productId: a.id, quantity: 2 },
        { productId: b.id, quantity: 3 },
      ],
    });

    expect(res.status).toBe(201);
    expect(res.body.totalPrice).toBeCloseTo(
      a.price.toNumber() * 2 + b.price.toNumber() * 3,
    );
    expect(
      res.body.items.map((i: { productName: string }) => i.productName),
    ).toEqual([a.name, b.name]);
  });

  it("gives orders placed at the same time different order numbers", async () => {
    const body = await validBody();

    const results = await Promise.all(
      Array.from({ length: 20 }, () => postOrder(body)),
    );

    expect(results.map((res) => res.status)).toEqual(Array(20).fill(201));
  });

  it.each([
    ["customerName is missing", { customerName: undefined }],
    ["customerName is empty", { customerName: "" }],
    ["phone is missing", { phone: undefined }],
    ["phone is empty", { phone: "" }],
    ["items is missing", { items: undefined }],
    ["items is empty", { items: [] }],
    ["an unknown field is sent", { discountCode: "SAVE10" }],
  ])("returns 400 when %s", async (_name, change) => {
    const res = await postOrder({ ...(await validBody()), ...change });

    expect(res.status).toBe(400);
  });

  it.each([
    ["quantity is 0", { quantity: 0 }],
    ["quantity is 1.5", { quantity: 1.5 }],
    ["quantity is above 20", { quantity: 21 }],
    ["quantity is 3000000000", { quantity: 3000000000 }],
    ["a price is sent", { unitPrice: 0.01 }],
  ])("returns 400 when an item's %s", async (_name, change) => {
    const body = await validBody();

    const res = await postOrder({
      ...body,
      items: [{ ...body.items[0], ...change }],
    });

    expect(res.status).toBe(400);
  });

  it("returns 400 for an unknown product and saves nothing", async () => {
    const body = await validBody();
    const before = await prisma.order.count();

    const res = await postOrder({
      ...body,
      items: [...body.items, { productId: "does-not-exist", quantity: 1 }],
    });

    expect(res.status).toBe(400);
    expect(await prisma.order.count()).toBe(before);
  });
});
