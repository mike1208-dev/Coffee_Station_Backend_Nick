import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";

export async function cleanDatabase() {
  if (env.NODE_ENV !== "test") {
    throw new Error("cleanDatabase can only run when NODE_ENV=test");
  }
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
}
