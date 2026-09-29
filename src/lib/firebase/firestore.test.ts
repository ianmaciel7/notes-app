import { describe, expect, it } from "vitest";
import { connectToFirestoreEmulator, db } from "./firestore";

describe("Firestore Native Client", () => {
  it("initializes firestore instance as a singleton", () => {
    expect(db).toBeDefined();
    expect(db.type).toBe("firestore");
    expect(db.app).toBeDefined();
  });

  it("connects to emulator idempotently without throwing", () => {
    expect(() => connectToFirestoreEmulator("127.0.0.1", 8080)).not.toThrow();
    // Subsequent calls should be guarded and safe
    expect(() => connectToFirestoreEmulator("127.0.0.1", 8080)).not.toThrow();
  });

  it("preserves emulator connection state on globalThis", () => {
    const globalForFirestore = globalThis as unknown as {
      __FIREBASE_FIRESTORE_EMULATOR_CONNECTED__?: boolean;
    };
    expect(globalForFirestore.__FIREBASE_FIRESTORE_EMULATOR_CONNECTED__).toBe(
      true,
    );
  });
});
