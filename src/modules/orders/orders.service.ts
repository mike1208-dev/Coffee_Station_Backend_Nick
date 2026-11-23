import { BadRequestError } from "../../common/app-error.js";
import { prisma } from "../../config/prisma.js";
import { randomUUID } from "node:crypto";

interface CreateOrderInput {
  customerName: string;
  phone: string;
  items: { productId: string; quantity: number }[];
}

export async function createOrder(input: CreateOrderInput) {
  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productById = new Map(products.map((product) => [product.id, product]));

  const orderItemsData = input.items.map((item) => {
    const product = productById.get(item.productId);
    if (!product) {
      throw new BadRequestError(`Unknown product: ${item.productId}`);
    }
    return {
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
    };
  });

  const totalPrice = orderItemsData
    .map((item) => item.unitPrice.times(item.quantity))
    .reduce((sum, lineTotal) => sum.plus(lineTotal));

  return prisma.order.create({
    data: {
      orderNumber: `ORD-${randomUUID().slice(0, 8).toUpperCase()}`,
      customerName: input.customerName,
      phone: input.phone,
      totalPrice,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });
}
