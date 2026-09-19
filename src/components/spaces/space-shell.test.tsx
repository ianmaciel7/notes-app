import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { SpaceShell } from "./space-shell";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-i18n", () => ({
  useI18n: () => ({
    locale: "en",
    t: (key: string) => key,
  }),
}));

vi.mock("@/lib/i18n/dictionaries", () => ({
  getDictionary: vi.fn(async () => ({
    common: {
      skipToContent: "Skip to content",
      toggleSidebar: "Toggle sidebar",
      close: "Close",
    },
    spaces: {
      title: "Spaces",
      mySpaces: "My Spaces",
      overview: "Overview",
      noSpaces: "No spaces yet",
      switchSpace: "Switch space",
      createSpace: "Create Space",
      renameSpace: "Rename Space",
      namePlaceholder: "Space name",
    },
    objects: {
      questions: "Questions",
      exams: "Exams",
      collections: "Collections",
      study: "Study",
    },
  })),
}));

describe("SpaceShell", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders navigation links including spaceId in hrefs", async () => {
    const component = await SpaceShell({
      spaceId: "space-123",
      lang: "en",
      spaces: [{ id: "space-123", name: "Alpha Space" }],
      children: <div data-testid="test-content">Space Content</div>,
    });

    render(component);

    expect(screen.getByTestId("test-content")).toBeDefined();

    // Check navigation links
    const overviewLink = screen.getByRole("link", { name: "Overview" });
    expect(overviewLink.getAttribute("href")).toBe("/en/spaces/space-123");

    const questionsLink = screen.getByRole("link", { name: "Questions" });
    expect(questionsLink.getAttribute("href")).toBe(
      "/en/spaces/space-123/questions",
    );

    const examsLink = screen.getByRole("link", { name: "Exams" });
    expect(examsLink.getAttribute("href")).toBe("/en/spaces/space-123/exams");

    const studyLink = screen.getByRole("link", { name: "Study" });
    expect(studyLink.getAttribute("href")).toBe("/en/spaces/space-123/study");

    const collectionsLink = screen.getByRole("link", { name: "Collections" });
    expect(collectionsLink.getAttribute("href")).toBe(
      "/en/spaces/space-123/collections",
    );

    // Skip to content link
    const skipLink = screen.getByText("Skip to content");
    expect(skipLink.getAttribute("href")).toBe("#main-content");
  });
});
