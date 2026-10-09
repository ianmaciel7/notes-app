// @vitest-environment node
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentIdentity: vi.fn(async (): Promise<{ uid: string } | null> => null),
  get: vi.fn(),
  set: vi.fn(),
  doc: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/firebase/identity", () => ({
  getCurrentIdentity: mocks.getCurrentIdentity,
}));
vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminFirestore: () => ({
    collection: () => ({ doc: mocks.doc }),
  }),
}));

// `server-only` is resolved by Next.js and is not installed, so the module under
// test is imported dynamically after the mock is registered.
type LocaleDal = typeof import("@/data/locale-dal");

let readProfileLocale: LocaleDal["readProfileLocale"];
let writeProfileLocale: LocaleDal["writeProfileLocale"];
let syncProfileLocale: LocaleDal["syncProfileLocale"];

beforeAll(async () => {
  ({ readProfileLocale, syncProfileLocale, writeProfileLocale } = await import(
    "@/data/locale-dal"
  ));
});

describe("locale Data Access Layer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", "production");
    mocks.getCurrentIdentity.mockResolvedValue(null);
    mocks.doc.mockReturnValue({ get: mocks.get, set: mocks.set });
  });

  it("reads nothing for a guest without touching Firestore", async () => {
    await expect(readProfileLocale()).resolves.toBeNull();
    expect(mocks.doc).not.toHaveBeenCalled();
  });

  it("writes nothing for a guest and reports it", async () => {
    await expect(writeProfileLocale("es")).resolves.toBe(false);
    expect(mocks.set).not.toHaveBeenCalled();
  });

  it("reads the verified user's own profile locale", async () => {
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "alice" });
    mocks.get.mockResolvedValue({ data: () => ({ locale: "pt-BR" }) });

    await expect(readProfileLocale()).resolves.toBe("pt-BR");
    expect(mocks.doc).toHaveBeenCalledWith("alice");
  });

  it("ignores a stored value that is not a supported locale", async () => {
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "alice" });
    mocks.get.mockResolvedValue({ data: () => ({ locale: "fr" }) });

    await expect(readProfileLocale()).resolves.toBeNull();
  });

  it("writes only to the verified user's own profile", async () => {
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "alice" });
    mocks.set.mockResolvedValue(undefined);

    await expect(writeProfileLocale("es")).resolves.toBe(true);
    expect(mocks.doc).toHaveBeenCalledWith("alice");
    expect(mocks.set).toHaveBeenCalledWith({ locale: "es" }, { merge: true });
  });

  it("authenticates once and migrates an explicit locale when none is stored", async () => {
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "alice" });
    mocks.get.mockResolvedValue({ data: () => ({}) });

    await expect(syncProfileLocale("es")).resolves.toBe("es");
    expect(mocks.getCurrentIdentity).toHaveBeenCalledOnce();
    expect(mocks.set).toHaveBeenCalledOnce();
    expect(mocks.set).toHaveBeenCalledWith({ locale: "es" }, { merge: true });
  });

  it("does not access Firestore for a guest with an explicit locale", async () => {
    await expect(syncProfileLocale("es")).resolves.toBeNull();
    expect(mocks.doc).not.toHaveBeenCalled();
    expect(mocks.set).not.toHaveBeenCalled();
  });

  it("returns a stored locale instead of overwriting it with an explicit locale", async () => {
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "alice" });
    mocks.get.mockResolvedValue({ data: () => ({ locale: "pt-BR" }) });

    await expect(syncProfileLocale("es")).resolves.toBe("pt-BR");
    expect(mocks.set).not.toHaveBeenCalled();
  });
});
