import express from "express";
import { postOrder } from "./orders.controller.js";

export const ordersRouter = express.Router();

ordersRouter.post("/", postOrder);
