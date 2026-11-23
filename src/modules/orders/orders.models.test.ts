import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../../config/prisma.js";

const createdOrderIds: string[] = [];

afterEach(async () => {
  await prisma.order.deleteMany({ where: { id: { in: createdOrderIds } } });
  createdOrderIds.length = 0;
});

async function createOrder(orderNumber = `TEST-${randomUUID()}`) {
  const product = await prisma.product.findFirstOrThrow();
  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: "Test Customer",
      phone: "000-0000-0000",
      totalPrice: product.price.mul(2),
      items: {
        create: [
          {
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            quantity: 2,
          },
        ],
      },
    },
    include: { items: true },
  });
  createdOrderIds.push(order.id);
  return order;
}

describe("Order model", () => {
  it("saves an order with its items and starts as Pending", async () => {
    const order = await createOrder();

    expect(order.status).toBe("Pending");
    expect(order.items).toHaveLength(1);
    expect(order.items[0].quantity).toBe(2);
  });

  it("rejects a duplicate order number", async () => {
    const order = await createOrder();

    await expect(createOrder(order.orderNumber)).rejects.toMatchObject({
      code: "P2002",
    });
  });

  it("deletes the items when the order is deleted", async () => {
    const order = await createOrder();

    await prisma.order.delete({ where: { id: order.id } });

    expect(await prisma.orderItem.count({ where: { orderId: order.id } })).toBe(
      0,
    );
  });
});
