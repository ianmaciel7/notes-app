import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SpacePage from "./page";

vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace: string) => {
    const messages: Record<string, Record<string, string>> = {
      app: {
        title: "Notes App",
        footer: "Notes App • Firebase Auth",
        backToHome: "Back to Home",
      },
      spaces: {
        activeSpaceLabel: "Active Space",
        spaceTitle: "Space: {id}",
      },
    };

    return (key: string, values?: Record<string, string>) => {
      let message = messages[namespace]?.[key] ?? key;
      for (const [name, value] of Object.entries(values ?? {})) {
        message = message.replace(`{${name}}`, value);
      }
      return message;
    };
  },
}));

vi.mock("@/components/notes-app/require-auth", () => ({
  RequireAuth: ({
    children,
    redirectTo,
  }: {
    children: React.ReactNode;
    redirectTo?: string;
  }) => (
    <div data-testid="mock-require-auth" data-redirect-to={redirectTo}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/notes-app/space-switcher", () => ({
  SpaceSwitcher: ({ currentSpaceId }: { currentSpaceId?: string }) => (
    <div data-testid="mock-space-switcher">
      SpaceSwitcher for {currentSpaceId}
    </div>
  ),
}));

vi.mock("@/components/notes-app/user-menu", () => ({
  UserMenu: () => <div data-testid="mock-user-menu">UserMenu</div>,
}));

describe("SpacePage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders space page with active spaceId and space switcher", async () => {
    const pageComponent = await SpacePage({
      params: Promise.resolve({ spaceId: "test-space-456" }),
      searchParams: Promise.resolve({}),
    } as Parameters<typeof SpacePage>[0]);

    render(pageComponent);

    expect(screen.getByText("Space: test-space-456")).toBeDefined();
    expect(screen.getByTestId("mock-space-switcher")).toBeDefined();
    expect(screen.getByText("SpaceSwitcher for test-space-456")).toBeDefined();
    expect(screen.getByTestId("mock-user-menu")).toBeDefined();
    expect(
      screen.getByTestId("mock-require-auth").getAttribute("data-redirect-to"),
    ).toBe("/login?next=%2Ftest-space-456");
  });
});
