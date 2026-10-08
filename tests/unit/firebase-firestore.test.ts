import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  app: { name: "app" },
  clear: vi.fn(async () => undefined),
  connect: vi.fn(),
  getFirestore: vi.fn(),
  initialize: vi.fn(),
  terminate: vi.fn(async () => undefined),
}));

vi.mock("firebase/firestore", () => ({
  clearIndexedDbPersistence: mocks.clear,
  connectFirestoreEmulator: mocks.connect,
  getFirestore: mocks.getFirestore,
  initializeFirestore: mocks.initialize,
  persistentLocalCache: vi.fn((options: unknown) => ({ persistent: options })),
  persistentMultipleTabManager: vi.fn(() => "multi-tab"),
  terminate: mocks.terminate,
}));
vi.mock("@/lib/firebase/client", () => ({
  getFirebaseClient: () => ({ app: mocks.app }),
}));

const originalWindow = globalThis.window;

async function loadModule() {
  vi.resetModules();
  return import("@/lib/firebase/firestore");
}

describe("Firestore access boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.initialize.mockImplementation(() => ({ id: Symbol("db") }));
    mocks.getFirestore.mockImplementation(() => ({ id: Symbol("default") }));
  });

  afterEach(() => {
    vi.stubGlobal("window", originalWindow);
    vi.stubEnv("NODE_ENV", "test");
  });

  it("uses a persistent multi-tab cache and the emulator outside production", async () => {
    const { clearFirestoreCache } = await loadModule();

    await clearFirestoreCache();

    expect(mocks.initialize).toHaveBeenCalledWith(mocks.app, {
      localCache: { persistent: { tabManager: "multi-tab" } },
    });
    const db = mocks.initialize.mock.results[0]?.value;
    expect(mocks.connect).toHaveBeenCalledWith(db, "127.0.0.1", 8080);
  });

  it("never connects the emulator in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { clearFirestoreCache } = await loadModule();

    await clearFirestoreCache();

    expect(mocks.connect).not.toHaveBeenCalled();
  });

  it("falls back to the existing or in-memory instance when persistence fails", async () => {
    mocks.initialize.mockImplementation(() => {
      throw new Error("already initialized");
    });
    const { clearFirestoreCache } = await loadModule();

    await clearFirestoreCache();

    expect(mocks.getFirestore).toHaveBeenCalledWith(mocks.app);
    expect(mocks.terminate).toHaveBeenCalledOnce();
  });

  it("does nothing on the server", async () => {
    vi.stubGlobal("window", undefined);
    const { clearFirestoreCache } = await loadModule();

    await clearFirestoreCache();

    expect(mocks.initialize).not.toHaveBeenCalled();
    expect(mocks.terminate).not.toHaveBeenCalled();
    expect(mocks.clear).not.toHaveBeenCalled();
  });

  it("terminates before clearing persistence, then starts a fresh instance", async () => {
    const { clearFirestoreCache } = await loadModule();
    const order: string[] = [];
    mocks.terminate.mockImplementationOnce(async () => {
      order.push("terminate");
    });
    mocks.clear.mockImplementationOnce(async () => {
      order.push("clear");
    });

    await clearFirestoreCache();
    await clearFirestoreCache();

    expect(order).toEqual(["terminate", "clear"]);
    expect(mocks.initialize).toHaveBeenCalledTimes(2);
    expect(mocks.connect).toHaveBeenCalledTimes(2);
  });

  it("rejects when the persistent cache cannot be cleared", async () => {
    const { clearFirestoreCache } = await loadModule();
    mocks.clear.mockRejectedValueOnce(new Error("failed-precondition"));

    await expect(clearFirestoreCache()).rejects.toThrow("failed-precondition");
  });
});
