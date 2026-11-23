import { z } from "zod";

export const createOrderSchema = z
  .object({
    customerName: z.string().min(1),
    phone: z.string().min(1),
    items: z
      .array(
        z
          .object({
            productId: z.string().min(1),
            quantity: z.int().positive(),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();
