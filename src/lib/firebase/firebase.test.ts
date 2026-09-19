import { describe, expect, it } from "vitest";
import { auth, db, firebaseApp, functions, rtdb, storage } from "./client";

describe("Firebase Client SDK Services", () => {
  it("initializes all core Firebase client services", () => {
    expect(firebaseApp).toBeDefined();
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
    expect(storage).toBeDefined();
    expect(rtdb).toBeDefined();
    expect(functions).toBeDefined();
  });
});
