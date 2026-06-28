import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    "@prooflog/crypto",
    "@prooflog/db",
    "drizzle-orm",
    "@neondatabase/serverless",
  ],
});
