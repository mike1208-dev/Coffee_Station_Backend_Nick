import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  globalIgnores(["dist/", "coverage/", "src/generated/"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  prettier,
]);
