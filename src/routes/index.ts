import express from "express";
import { productsRouter } from "../modules/products/products.routes.js";
import { ordersRouter } from "../modules/orders/orders.routes.js";

export const router = express.Router();

router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
