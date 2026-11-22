import { prisma } from "../config/prisma.js";

export async function cleanDatabase() {
  await prisma.product.deleteMany();
}
