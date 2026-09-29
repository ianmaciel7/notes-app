import { describe, expect, it } from "vitest";
import {
  connectToFirestoreEmulator,
  db,
  getOrCreateFirestore,
} from "./firestore";

describe("Firestore Native Client", () => {
  it("initializes firestore instance as a singleton", () => {
    expect(db).toBeDefined();
    expect(db.type).toBe("firestore");
    expect(db.app).toBeDefined();
  });

  it("connects to emulator idempotently without throwing", () => {
    expect(() => connectToFirestoreEmulator()).not.toThrow();
    const globalForFirestore = globalThis as unknown as {
      __FIREBASE_FIRESTORE_EMULATOR_CONNECTED__?: boolean;
    };
    globalForFirestore.__FIREBASE_FIRESTORE_EMULATOR_CONNECTED__ = false;
    expect(() => connectToFirestoreEmulator("localhost", 8080)).not.toThrow();
  });

  it("preserves emulator connection state on globalThis", () => {
    const globalForFirestore = globalThis as unknown as {
      __FIREBASE_FIRESTORE_EMULATOR_CONNECTED__?: boolean;
    };
    expect(globalForFirestore.__FIREBASE_FIRESTORE_EMULATOR_CONNECTED__).toBe(
      true,
    );
  });

  it("returns firestore instance via getOrCreateFirestore", () => {
    const instance = getOrCreateFirestore();
    expect(instance).toBeDefined();
    expect(instance.type).toBe("firestore");
  });
});
