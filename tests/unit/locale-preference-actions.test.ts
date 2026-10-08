import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  getCurrentIdentity: vi.fn(async (): Promise<{ uid: string } | null> => null),
  readProfileLocale: vi.fn(async (): Promise<string | null> => null),
  writeProfileLocale: vi.fn(async () => undefined),
  getCookie: vi.fn((): { value: string } | undefined => undefined),
  setCookie: vi.fn(),
}));

vi.mock("next/cache", () => ({ refresh: mocks.refresh }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: mocks.getCookie, set: mocks.setCookie }),
}));
vi.mock("@/lib/firebase/identity", () => ({
  getCurrentIdentity: mocks.getCurrentIdentity,
}));
vi.mock("@/lib/i18n/profile-preference", () => ({
  readProfileLocale: mocks.readProfileLocale,
  writeProfileLocale: mocks.writeProfileLocale,
}));

import { setLocalePreference, syncLocalePreference } from "@/lib/i18n/actions";

describe("locale preference server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentIdentity.mockResolvedValue(null);
    mocks.readProfileLocale.mockResolvedValue(null);
    mocks.getCookie.mockReturnValue(undefined);
  });

  it("rejects invalid locales without mutating the cookie", async () => {
    await expect(setLocalePreference("invalid")).rejects.toThrow();
    expect(mocks.setCookie).not.toHaveBeenCalled();
    expect(mocks.writeProfileLocale).not.toHaveBeenCalled();
  });

  it("saves guest choices only in the explicit cookie", async () => {
    await setLocalePreference("pt-BR");
    expect(mocks.writeProfileLocale).not.toHaveBeenCalled();
    expect(mocks.setCookie).toHaveBeenCalledWith(
      "NEXT_LOCALE",
      "pt-BR",
      expect.objectContaining({ path: "/", sameSite: "lax" }),
    );
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("persists authenticated choices under the verified identity", async () => {
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "user-a" });
    await setLocalePreference("es");
    expect(mocks.writeProfileLocale).toHaveBeenCalledWith("user-a", "es");
    expect(mocks.setCookie).toHaveBeenCalledWith(
      "NEXT_LOCALE",
      "es",
      expect.any(Object),
    );
  });

  it("overrides the browser cookie with the signed-in user's profile", async () => {
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "user-b" });
    mocks.readProfileLocale.mockResolvedValue("pt-BR");
    await expect(syncLocalePreference()).resolves.toBe("pt-BR");
    expect(mocks.readProfileLocale).toHaveBeenCalledWith("user-b");
    expect(mocks.setCookie).toHaveBeenCalledWith(
      "NEXT_LOCALE",
      "pt-BR",
      expect.any(Object),
    );
  });

  it("migrates an explicit guest choice on first login", async () => {
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "user-c" });
    mocks.getCookie.mockReturnValue({ value: "es" });
    await expect(syncLocalePreference()).resolves.toBe("es");
    expect(mocks.writeProfileLocale).toHaveBeenCalledWith("user-c", "es");
  });

  it("never persists automatically negotiated locales", async () => {
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "user-d" });
    await expect(syncLocalePreference()).resolves.toBeNull();
    expect(mocks.writeProfileLocale).not.toHaveBeenCalled();
    expect(mocks.setCookie).not.toHaveBeenCalled();
  });

  it("does not fetch any profile for anonymous visitors", async () => {
    await expect(syncLocalePreference()).resolves.toBeNull();
    expect(mocks.readProfileLocale).not.toHaveBeenCalled();
  });
});
