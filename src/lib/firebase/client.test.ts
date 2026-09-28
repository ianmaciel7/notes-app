import { describe, expect, it } from "vitest";
import { app, auth, connectToAuthEmulator } from "./client";

describe("Firebase client", () => {
  it("initializes firebase app instance", () => {
    expect(app).toBeDefined();
    expect(app.name).toBe("[DEFAULT]");
  });

  it("initializes firebase auth instance", () => {
    expect(auth).toBeDefined();
    expect(auth.app).toBe(app);
  });

  it("handles idempotent emulator connection without throwing", () => {
    expect(() => connectToAuthEmulator()).not.toThrow();
  });
});
