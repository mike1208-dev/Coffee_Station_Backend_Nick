import type { z } from "zod";
import { BadRequestError } from "./app-error.js";

export function validate<T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path.join(".");
    throw new BadRequestError(
      field ? `${field}: ${issue.message}` : issue.message,
    );
  }
  return result.data;
}
