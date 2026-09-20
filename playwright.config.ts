import { defineConfig, devices } from "@playwright/test";

// Tests share one emulator instance and sign in as real users, so they run
// serially — parallel workers would race on the session cookie and on each
// other's Space membership.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "pnpm run emulators",
      url: "http://127.0.0.1:8080",
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      stdout: "ignore",
    },
    {
      command: "pnpm dev",
      url: "http://localhost:3000/login",
      timeout: 180_000,
      reuseExistingServer: !process.env.CI,
      stdout: "ignore",
    },
  ],
});
