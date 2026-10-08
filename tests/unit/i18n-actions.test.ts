import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookieStore: { set: vi.fn() },
  refresh: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => mocks.cookieStore),
}));
vi.mock("next/cache", () => ({ refresh: mocks.refresh }));

import { setLocalePreference } from "@/lib/i18n/actions";

describe("setLocalePreference", () => {
  beforeEach(() => {
    mocks.cookieStore.set.mockReset();
    mocks.refresh.mockReset();
  });

  it("sets a one-year cookie and refreshes the route", async () => {
    await setLocalePreference("pt-BR");

    expect(mocks.cookieStore.set).toHaveBeenCalledWith("NEXT_LOCALE", "pt-BR", {
      maxAge: 31_536_000,
      path: "/",
      sameSite: "lax",
    });
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("rejects unsupported locales without writing", async () => {
    await expect(setLocalePreference("fr")).rejects.toThrow(
      "Unsupported locale: fr",
    );
    expect(mocks.cookieStore.set).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });
});
