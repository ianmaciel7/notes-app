import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Space } from "@/types/space";
import { SpaceSwitcher } from "./space-switcher";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
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

    const { container } = render(<SpaceSwitcher />);
    expect(container.firstChild).toBeNull();
  });

  it("renders loading state", () => {
    mockUseSpaces.mockReturnValue({
      spaces: [],
      loading: true,
      error: null,
      createSpace: vi.fn(),
    });

    render(<SpaceSwitcher />);
    expect(screen.getByTestId("space-switcher-loading")).toBeDefined();
    expect(screen.getByText("Loading spaces...")).toBeDefined();
  });

  it("renders empty state using Empty component when spaces are empty", () => {
    mockUseSpaces.mockReturnValue({
      spaces: [],
      loading: false,
      error: null,
      createSpace: vi.fn(),
    });

    render(<SpaceSwitcher />);
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
      createSpace: vi.fn(),
    });

    render(<SpaceSwitcher currentSpaceId="space-1" />);

    expect(screen.getByTestId("space-switcher")).toBeDefined();
    expect(screen.getByTestId("space-switcher-trigger")).toBeDefined();
    expect(screen.getByText("Personal")).toBeDefined();

    const enterBtn = screen.getByTestId("enter-space-btn");
    fireEvent.click(enterBtn);
    expect(mockPush).toHaveBeenCalledWith("/space-1");
  });
});
