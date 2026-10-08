import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalFetch = globalThis.fetch;

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  signOut: vi.fn(async () => undefined),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const values: Record<string, string> = {
      signOut: "Sign out",
      signOutError: "Could not sign out. Please try again.",
    };
    return values[key] ?? key;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));
vi.mock("firebase/auth", () => ({ signOut: mocks.signOut }));
vi.mock("@/lib/firebase/client", () => ({
  getFirebaseClient: () => ({ auth: {} }),
}));

import { SignOutButton } from "@/components/notes-app/sign-out-button";

describe("SignOutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.stubGlobal("fetch", originalFetch);
  });

  it("keeps the browser signed in if the server refuses logout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false })),
    );
    render(<SignOutButton />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Could not sign out");
    expect(mocks.signOut).not.toHaveBeenCalled();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("keeps the browser signed in if the server is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    render(<SignOutButton />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Could not sign out",
    );
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it("signs out locally only after the server confirms cookie deletion", async () => {
    const request = vi.fn(async () => ({ ok: true }));
    vi.stubGlobal("fetch", request);
    render(<SignOutButton />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith("/sign-in"));
    expect(request).toHaveBeenCalledWith("/api/auth/session", {
      method: "DELETE",
    });
    expect(mocks.signOut).toHaveBeenCalledOnce();
    expect(mocks.refresh).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
