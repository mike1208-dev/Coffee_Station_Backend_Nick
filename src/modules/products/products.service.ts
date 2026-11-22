import { prisma } from "../../config/prisma.js";
import type { Category } from "../../generated/prisma/enums.js";

export function listProducts(category?: Category) {
  return prisma.product.findMany({
    where: category ? { category } : undefined,
  });
}
