import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: { languageCode: undefined as string | undefined },
  callback: undefined as
    | ((
        user: null | { getIdToken: (forceRefresh: boolean) => Promise<string> },
      ) => Promise<void>)
    | undefined,
  locale: "pt-BR" as "en" | "pt-BR" | "es",
  router: { refresh: vi.fn(), replace: vi.fn() },
  setLocale: vi.fn(),
}));

vi.mock("@firebase-oss/ui-core", () => ({
  initializeUI: vi.fn(() => ({
    get: () => ({ setLocale: mocks.setLocale }),
    isInitialized: true,
  })),
  providerRedirectStrategy: vi.fn(() => "redirect"),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(
    (_auth: typeof mocks.auth, callback: typeof mocks.callback) => {
      mocks.callback = callback;
      return vi.fn();
    },
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => mocks.router),
}));

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseClient: vi.fn(() => ({ app: {}, auth: mocks.auth })),
}));

vi.mock("@/lib/i18n/client", () => ({
  applyAuthLocale: vi.fn((auth, ui, locale) => {
    auth.languageCode = locale;
    ui.setLocale(locale);
  }),
  resolveClientLocale: vi.fn(() => mocks.locale),
}));

import { useAuthProvider } from "@/hooks/use-auth-provider";

describe("useAuthProvider locale synchronization", () => {
  beforeEach(() => {
    mocks.auth.languageCode = undefined;
    mocks.callback = undefined;
    mocks.locale = "pt-BR";
    mocks.router.refresh.mockReset();
    mocks.router.replace.mockReset();
    mocks.setLocale.mockReset();
    vi.clearAllMocks();
  });

  it("applies the resolved locale for a signed-out user", async () => {
    renderHook(() => useAuthProvider());

    await act(async () => {
      await mocks.callback?.(null);
    });

    expect(mocks.auth.languageCode).toBe("pt-BR");
    expect(mocks.setLocale).toHaveBeenCalledWith("pt-BR");
    expect(mocks.router.refresh).not.toHaveBeenCalled();
  });

  it("applies the resolved locale and keeps session behavior for a signed-in user", async () => {
    const user = { getIdToken: vi.fn(async () => "token") };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 200 })),
    );

    renderHook(() => useAuthProvider());

    await act(async () => {
      await mocks.callback?.(user);
    });

    expect(mocks.auth.languageCode).toBe("pt-BR");
    expect(user.getIdToken).toHaveBeenCalledWith(true);
    expect(mocks.router.replace).toHaveBeenCalledWith("/dashboard");
    expect(mocks.router.refresh).toHaveBeenCalledTimes(1);
  });
});
