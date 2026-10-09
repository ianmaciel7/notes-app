import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  writeProfileLocale: vi.fn(async (_locale: string) => false),
  syncProfileLocale: vi.fn(
    async (_locale: string | null): Promise<string | null> => null,
  ),
  getCookie: vi.fn((): { value: string } | undefined => undefined),
  setCookie: vi.fn(),
}));

vi.mock("next/cache", () => ({ refresh: mocks.refresh }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: mocks.getCookie, set: mocks.setCookie }),
}));
vi.mock("@/data/locale-dal", () => ({
  writeProfileLocale: mocks.writeProfileLocale,
  syncProfileLocale: mocks.syncProfileLocale,
}));

import {
  setLocalePreference,
  syncLocalePreference,
} from "@/actions/locale-actions";

describe("locale preference server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.writeProfileLocale.mockResolvedValue(false);
    mocks.syncProfileLocale.mockResolvedValue(null);
    mocks.getCookie.mockReturnValue(undefined);
  });

  it("rejects invalid locales without mutating the cookie", async () => {
    await expect(setLocalePreference("invalid")).rejects.toThrow();
    expect(mocks.setCookie).not.toHaveBeenCalled();
    expect(mocks.writeProfileLocale).not.toHaveBeenCalled();
  });

  it("saves guest choices only in the explicit cookie", async () => {
    await setLocalePreference("pt-BR");
    expect(mocks.writeProfileLocale).toHaveBeenCalledWith("pt-BR");
    expect(mocks.setCookie).toHaveBeenCalledWith(
      "NEXT_LOCALE",
      "pt-BR",
      expect.objectContaining({ path: "/", sameSite: "lax" }),
    );
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("hands the choice to the Data Access Layer, which verifies the identity", async () => {
    mocks.writeProfileLocale.mockResolvedValue(true);
    await setLocalePreference("es");
    expect(mocks.writeProfileLocale).toHaveBeenCalledWith("es");
    expect(mocks.setCookie).toHaveBeenCalledWith(
      "NEXT_LOCALE",
      "es",
      expect.any(Object),
    );
  });

  it("overrides the browser cookie with the signed-in user's profile", async () => {
    mocks.syncProfileLocale.mockResolvedValue("pt-BR");
    await expect(syncLocalePreference()).resolves.toBe("pt-BR");
    expect(mocks.syncProfileLocale).toHaveBeenCalledOnce();
    expect(mocks.syncProfileLocale).toHaveBeenCalledWith(null);
    expect(mocks.setCookie).toHaveBeenCalledWith(
      "NEXT_LOCALE",
      "pt-BR",
      expect.any(Object),
    );
  });

  it("migrates an explicit guest choice on first login", async () => {
    mocks.getCookie.mockReturnValue({ value: "es" });
    mocks.syncProfileLocale.mockResolvedValue("es");
    await expect(syncLocalePreference()).resolves.toBe("es");
    expect(mocks.syncProfileLocale).toHaveBeenCalledOnce();
    expect(mocks.syncProfileLocale).toHaveBeenCalledWith("es");
  });

  it("never persists automatically negotiated locales", async () => {
    await expect(syncLocalePreference()).resolves.toBeNull();
    expect(mocks.syncProfileLocale).toHaveBeenCalledOnce();
    expect(mocks.syncProfileLocale).toHaveBeenCalledWith(null);
    expect(mocks.writeProfileLocale).not.toHaveBeenCalled();
    expect(mocks.setCookie).not.toHaveBeenCalled();
  });

  it("does not save a cookie for a guest with an explicit locale", async () => {
    mocks.getCookie.mockReturnValue({ value: "es" });
    await expect(syncLocalePreference()).resolves.toBeNull();
    expect(mocks.syncProfileLocale).toHaveBeenCalledOnce();
    expect(mocks.syncProfileLocale).toHaveBeenCalledWith("es");
    expect(mocks.setCookie).not.toHaveBeenCalled();
  });
});
