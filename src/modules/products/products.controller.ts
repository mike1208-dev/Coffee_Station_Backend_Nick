import type { Request, Response } from "express";
import { BadRequestError } from "../../common/app-error.js";
import { Category } from "../../generated/prisma/enums.js";
import { listProducts } from "./products.service.js";

export async function getProducts(req: Request, res: Response) {
  const { category } = req.query;

  if (category !== undefined) {
    if (typeof category !== "string" || !Object.values(Category).includes(category as Category)) {
      throw new BadRequestError(`Invalid category: ${category}`);
    }
  }

  const products = await listProducts(category as Category | undefined);
  res.json(products);
}
