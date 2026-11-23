import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { errorHandler } from "./error-handler.js";
import { validate } from "./validate.js";

const bodySchema = z.strictObject({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
});
const querySchema = z.object({ limit: z.coerce.number().int().positive() });

const app = express();
app.use(express.json());
app.post("/test", (req, res) => {
  res.json(validate(bodySchema, req.body));
});
app.get("/test", (req, res) => {
  res.json(validate(querySchema, req.query));
});
app.use(errorHandler);

describe("validate", () => {
  it("passes the parsed body to the handler", async () => {
    const res = await request(app)
      .post("/test")
      .send({ name: "Latte", quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: "Latte", quantity: 2 });
  });

  it("returns 400 for a missing field", async () => {
    const res = await request(app).post("/test").send({ quantity: 2 });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain("name");
  });

  it("returns 400 for an unknown field", async () => {
    const res = await request(app)
      .post("/test")
      .send({ name: "Latte", quantity: 2, price: 0.01 });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain("price");
  });

  it("parses query values", async () => {
    const res = await request(app).get("/test?limit=5");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ limit: 5 });
  });

  it("names the nested field of an invalid item", () => {
    const schema = z.strictObject({
      items: z.array(z.strictObject({ quantity: z.number().int().positive() })),
    });

    expect(() => validate(schema, { items: [{ quantity: 0 }] })).toThrow(
      "items.0.quantity",
    );
  });
});
