import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.firebase.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "server-only": path.resolve("./src/test/server-only-stub.ts"),
    },
  },
});
