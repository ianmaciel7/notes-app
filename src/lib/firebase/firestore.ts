import {
  connectFirestoreEmulator,
  type Firestore,
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { app } from "./client";

let firestoreInstance: Firestore;

// Initialize Firestore with native Firebase offline persistence (IndexedDB cache) only in browser environments
if (typeof window !== "undefined") {
  try {
    firestoreInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (_e) {
    // Fallback if already initialized (HMR) or if IndexedDB is restricted (private browsing)
    try {
      firestoreInstance = getFirestore(app);
    } catch {
      firestoreInstance = initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    }
  }
} else {
  // SSR / Server Component environment
  firestoreInstance = getFirestore(app);
}

export const db: Firestore = firestoreInstance;

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      !message.includes("already been started") &&
      !message.includes("already connected") &&
      process.env.NODE_ENV === "development"
    ) {
      console.warn("[Firestore] Emulator connection notice:", message);
    }
  }
}

if (shouldUseEmulator) {
  connectToFirestoreEmulator();
}
