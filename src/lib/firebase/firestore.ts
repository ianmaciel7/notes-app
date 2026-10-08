import type { FirebaseApp } from "firebase/app";
import {
  clearIndexedDbPersistence,
  connectFirestoreEmulator,
  type Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  terminate,
} from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebase/client";

const FIRESTORE_EMULATOR_HOST = "127.0.0.1";
const FIRESTORE_EMULATOR_PORT = 8080;

// Module state lives on globalThis so Fast Refresh reloads this module without
// re-initializing Firestore or reconnecting the emulator.
const stateKey = Symbol.for("notes-app.firestore.state");
type FirestoreState = {
  instance?: Firestore;
  emulatorConnected: WeakSet<Firestore>;
};

function getState(): FirestoreState {
  const store = globalThis as typeof globalThis & {
    [stateKey]?: FirestoreState;
  };
  store[stateKey] ??= { emulatorConnected: new WeakSet() };
  return store[stateKey];
}

function createFirestore(app: FirebaseApp): Firestore {
  // Persistent IndexedDB cache is browser-only; the server keeps the default
  // in-memory cache.
  if (typeof window === "undefined") {
    return getFirestore(app);
  }

  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    // Repeated initialization or unsupported storage: reuse the existing
    // instance, or fall back to the default in-memory cache.
    return getFirestore(app);
  }
}

/**
 * Single access point for the browser Firestore instance (ADR 0008).
 * Not exported until the first data consumer needs it.
 */
function getDb(): Firestore {
  const state = getState();

  if (state.instance) {
    return state.instance;
  }

  const created = createFirestore(getFirebaseClient().app);

  if (
    process.env.NODE_ENV !== "production" &&
    !state.emulatorConnected.has(created)
  ) {
    connectFirestoreEmulator(
      created,
      FIRESTORE_EMULATOR_HOST,
      FIRESTORE_EMULATOR_PORT,
    );
    state.emulatorConnected.add(created);
  }

  state.instance = created;
  return created;
}

/**
 * Notes are user data: the persistent cache must not outlive the signed-in
 * user. Terminates the instance, then clears IndexedDB. Rejects when the
 * cache cannot be cleared (for example other tabs still hold it), so the
 * caller can surface the failure.
 */
export async function clearFirestoreCache(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const current = getDb();
  getState().instance = undefined;
  await terminate(current);
  await clearIndexedDbPersistence(current);
}
