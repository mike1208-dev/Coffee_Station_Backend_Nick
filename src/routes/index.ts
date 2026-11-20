import express from "express";
import { productsRouter } from "../modules/products/products.routes.js";

export const router = express.Router();

router.use("/products", productsRouter);
