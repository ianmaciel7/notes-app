import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import messages from "@/messages/en.json";
import type { Space } from "@/types/space";
import { SpaceSwitcher } from "./space-switcher";

function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

const mockUseSpaces = vi.fn();
vi.mock("@/hooks/use-spaces", () => ({
  useSpaces: () => mockUseSpaces(),
}));

const mockUseAuth = vi.fn();
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("SpaceSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { uid: "test-user-id" },
      isLoading: false,
    });
    mockUseSpaces.mockReturnValue({
      spaces: [],
      loading: false,
      error: null,
      isOffline: false,
      retry: vi.fn(),
      createSpace: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("returns null when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    const { container } = renderWithIntl(<SpaceSwitcher />);
    expect(container.firstChild).toBeNull();
  });

  it("renders accessible error alert with retry button when error occurs", () => {
    const retryMock = vi.fn();
    mockUseSpaces.mockReturnValue({
      spaces: [],
      loading: false,
      error: new Error("auth/network-request-failed"),
      isOffline: false,
      retry: retryMock,
      createSpace: vi.fn(),
    });

    renderWithIntl(<SpaceSwitcher />);

    expect(screen.getByTestId("space-switcher-error")).toBeDefined();
    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByText("Connection Error")).toBeDefined();

    const retryBtn = screen.getByTestId("space-switcher-retry-btn");
    expect(retryBtn.textContent).toContain("Retry Connection");
    fireEvent.click(retryBtn);
    expect(retryMock).toHaveBeenCalled();
  });

  it("renders offline status indicator when isOffline is true", () => {
    const spaces: Space[] = [
      {
        id: "space-1",
        ownerId: "uid-1",
        name: "Personal",
        description: "",
        icon: "folder",
        stateVersion: 1,
        schemaVersion: 1,
        createdAt: null,
        updatedAt: null,
      },
    ];

    mockUseSpaces.mockReturnValue({
      spaces,
      loading: false,
      error: null,
      isOffline: true,
      retry: vi.fn(),
      createSpace: vi.fn(),
    });

    renderWithIntl(<SpaceSwitcher currentSpaceId="space-1" />);

    expect(screen.getByTestId("offline-status-indicator")).toBeDefined();
    expect(screen.getByText("Operating in offline mode")).toBeDefined();
  });

  it("renders loading state", () => {
    mockUseSpaces.mockReturnValue({
      spaces: [],
      loading: true,
      error: null,
      isOffline: false,
      retry: vi.fn(),
      createSpace: vi.fn(),
    });

    renderWithIntl(<SpaceSwitcher />);
    expect(screen.getByTestId("space-switcher-loading")).toBeDefined();
    expect(screen.getByText("Loading spaces...")).toBeDefined();
  });

  it("renders empty state using Empty component when spaces are empty", () => {
    mockUseSpaces.mockReturnValue({
      spaces: [],
      loading: false,
      error: null,
      isOffline: false,
      retry: vi.fn(),
      createSpace: vi.fn(),
    });

    renderWithIntl(<SpaceSwitcher />);
    expect(screen.getByTestId("space-switcher-empty")).toBeDefined();
    expect(screen.getByText("No Spaces Found")).toBeDefined();
    expect(screen.getByTestId("empty-create-space-btn")).toBeDefined();
  });

  it("renders inline switcher trigger and enter button when spaces exist", () => {
    const spaces: Space[] = [
      {
        id: "space-1",
        ownerId: "uid-1",
        name: "Personal",
        description: "",
        icon: "folder",
        stateVersion: 1,
        schemaVersion: 1,
        createdAt: null,
        updatedAt: null,
      },
    ];

    mockUseSpaces.mockReturnValue({
      spaces,
      loading: false,
      error: null,
      isOffline: false,
      retry: vi.fn(),
      createSpace: vi.fn(),
    });

    renderWithIntl(<SpaceSwitcher currentSpaceId="space-1" />);

    expect(screen.getByTestId("space-switcher")).toBeDefined();
    expect(screen.getByTestId("space-switcher-trigger")).toBeDefined();
    expect(screen.getByText("Personal")).toBeDefined();

    const enterBtn = screen.getByTestId("enter-space-btn");
    fireEvent.click(enterBtn);
    expect(mockPush).toHaveBeenCalledWith("/space-1");
  });
  it("does not fall back to another space when currentSpaceId is invalid", () => {
    const spaces: Space[] = [
      {
        id: "space-1",
        ownerId: "uid-1",
        name: "Personal",
        description: "",
        icon: "folder",
        stateVersion: 1,
        schemaVersion: 1,
        createdAt: null,
        updatedAt: null,
      },
    ];

    mockUseSpaces.mockReturnValue({
      spaces,
      loading: false,
      error: null,
      isOffline: false,
      retry: vi.fn(),
      createSpace: vi.fn(),
    });

    renderWithIntl(<SpaceSwitcher currentSpaceId="missing-space" />);

    expect(screen.getByTestId("space-switcher-not-found")).toBeDefined();
    expect(screen.queryByTestId("space-switcher-trigger")).toBeNull();

    fireEvent.click(screen.getByTestId("space-switcher-back-btn"));
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

});
