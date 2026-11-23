import type { Request, Response } from "express";
import { validate } from "../../common/validate.js";
import { createOrderSchema } from "./orders.schema.js";
import { createOrder } from "./orders.service.js";

export async function postOrder(req: Request, res: Response) {
  const input = validate(createOrderSchema, req.body);
  const order = await createOrder(input);
  res.status(201).json({
    ...order,
    totalPrice: order.totalPrice.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toNumber(),
    })),
  });
}
