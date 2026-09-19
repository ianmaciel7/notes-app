import { act, render, screen, waitFor } from "@testing-library/react";
import type { User } from "firebase/auth";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthGate } from "./auth-gate";

const mocks = vi.hoisted(() => ({
  authListener: undefined as ((user: User | null) => void) | undefined,
  onIdTokenChanged: vi.fn(),
  replace: vi.fn(),
  syncSession: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  onIdTokenChanged: mocks.onIdTokenChanged,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    locale: "en",
    t: (key: string) =>
      key === "errors.generic.network"
        ? "Unable to connect. Check your connection and try again."
        : key === "common.loading"
          ? "Loading..."
          : key,
  }),
}));

vi.mock("@/lib/auth/client-session", () => ({
  syncSession: mocks.syncSession,
}));

vi.mock("@/lib/firebase/client", () => ({
  auth: {},
}));

describe("AuthGate offline recovery", () => {
  beforeEach(() => {
    mocks.authListener = undefined;
    mocks.replace.mockReset();
    mocks.syncSession.mockReset();
    mocks.onIdTokenChanged.mockImplementation((_auth, listener) => {
      mocks.authListener = listener;
      return vi.fn();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows an offline recovery state without redirecting when session sync fails", async () => {
    mocks.syncSession.mockRejectedValue(new TypeError("Failed to fetch"));

    render(
      <AuthGate locale="en">
        <div>Protected content</div>
      </AuthGate>,
    );

    const user = {
      getIdToken: vi.fn().mockResolvedValue("cached-id-token"),
    } as unknown as User;

    await act(async () => {
      mocks.authListener?.(user);
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to connect",
    );
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(mocks.syncSession).toHaveBeenCalledWith("cached-id-token");
  });

  it("renders protected content after session sync succeeds", async () => {
    mocks.syncSession.mockResolvedValue(true);

    render(
      <AuthGate locale="en">
        <div>Protected content</div>
      </AuthGate>,
    );

    const user = {
      getIdToken: vi.fn().mockResolvedValue("valid-id-token"),
    } as unknown as User;

    await act(async () => {
      mocks.authListener?.(user);
    });

    await waitFor(() => {
      expect(screen.getByText("Protected content")).toBeInTheDocument();
    });
    expect(mocks.replace).not.toHaveBeenCalled();
  });
});
