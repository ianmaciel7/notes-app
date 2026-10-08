import { defineConfig } from "vitest/config";

// Security rules tests need the Firestore Emulator: run `pnpm run test:rules`.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/rules/**/*.test.ts"],
  },
});
