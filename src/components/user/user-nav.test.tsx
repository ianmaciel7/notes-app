import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signOut } from "firebase/auth";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import en from "@/app/[lang]/dictionaries/en.json";
import { UserNav } from "@/components/user/user-nav";
import { I18nProvider } from "@/components/i18n-provider";
import { deleteSession } from "@/lib/auth/client-session";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("firebase/auth", () => ({
  signOut: vi.fn(),
}));

vi.mock("@/lib/firebase/client", () => ({
  auth: {},
}));

vi.mock("@/lib/auth/client-session", () => ({
  deleteSession: vi.fn(),
}));

function renderUserNav(children: ReactNode) {
  return render(
    <I18nProvider dictionary={en} locale="en">
      {children}
    </I18nProvider>,
  );
}

describe("UserNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(signOut).mockResolvedValue(undefined);
    vi.mocked(deleteSession).mockResolvedValue(true);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders avatar with user initials and displays user name", () => {
    renderUserNav(
      <UserNav user={{ displayName: "Jane Doe", email: "jane@example.com" }} />,
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders email-based initial when displayName is missing", () => {
    renderUserNav(<UserNav user={{ email: "ian@example.com" }} />);

    expect(screen.getByText("IA")).toBeInTheDocument();
    expect(screen.getByText("ian@example.com")).toBeInTheDocument();
  });

  it("renders fallback initial 'U' when no user info is provided", () => {
    renderUserNav(<UserNav user={null} />);

    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("handles sign-out flow when clicking Sign Out in dropdown", async () => {
    const user = userEvent.setup();

    renderUserNav(
      <UserNav user={{ displayName: "Jane Doe", email: "jane@example.com" }} />,
    );

    // Open dropdown
    const trigger = screen.getByRole("button", { name: "Jane Doe" });
    await user.click(trigger);

    // Click Sign out
    const signOutBtn = await screen.findByRole("menuitem", {
      name: "Sign out",
    });
    await user.click(signOutBtn);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(deleteSession).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/en/sign-in");
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });
});
