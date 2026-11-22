import { execSync } from "node:child_process";

export async function setup() {
  const env = { ...process.env, NODE_ENV: "test" };

  execSync("npx prisma migrate deploy", { env, stdio: "inherit" });
  execSync("npx prisma db seed", { env, stdio: "inherit" });
}
