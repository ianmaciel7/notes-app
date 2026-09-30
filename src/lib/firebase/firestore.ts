import {
  connectFirestoreEmulator,
  type Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { installFirebaseLogCapture } from "@/lib/error-capture/firebase-logs";
import { app } from "./client";

installFirebaseLogCapture();

export function getOrCreateFirestore(targetApp = app): Firestore {
  if (typeof window !== "undefined") {
    try {
      return initializeFirestore(targetApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      return getFirestore(targetApp);
    }
  }
  return getFirestore(targetApp);
}

export const db: Firestore = getOrCreateFirestore();

const FIRESTORE_EMULATOR_HOST =
  process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST || "127.0.0.1";
const FIRESTORE_EMULATOR_PORT = Number(
  process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_PORT || 8080,
);

const shouldUseEmulator =
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" ||
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test";

// Global tracker to survive Next.js Fast Refresh / HMR
const globalForFirestore = globalThis as unknown as {
  __FIREBASE_FIRESTORE_EMULATOR_CONNECTED__?: boolean;
};

export function connectToFirestoreEmulator(
  host = FIRESTORE_EMULATOR_HOST,
  port = FIRESTORE_EMULATOR_PORT,
): void {
  if (globalForFirestore.__FIREBASE_FIRESTORE_EMULATOR_CONNECTED__) return;
  try {
    connectFirestoreEmulator(db, host, port);
    globalForFirestore.__FIREBASE_FIRESTORE_EMULATOR_CONNECTED__ = true;
  } catch {
    // Emulator connection is idempotent across Fast Refresh / test workers
  }
}

if (shouldUseEmulator) {
  connectToFirestoreEmulator();
}
