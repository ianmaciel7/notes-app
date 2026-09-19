import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as spaceActions from "@/lib/actions/space-actions";
import { SpaceSwitcher } from "./space-switcher";

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

describe("SpaceSwitcher", () => {
  const sampleSpaces = [
    { id: "space-1", name: "Primary Space" },
    { id: "space-2", name: "Secondary Space" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the current space name", () => {
    render(
      <SpaceSwitcher
        spaces={sampleSpaces}
        currentSpaceId="space-1"
        lang="en"
      />,
    );

    expect(screen.getByText("Primary Space")).toBeDefined();
  });

  it("submits create space form and calls createSpaceAction", async () => {
    const createSpy = vi
      .spyOn(spaceActions, "createSpaceAction")
      .mockResolvedValue({
        ok: true,
        data: { id: "space-new", name: "New Space" },
      });

    render(
      <SpaceSwitcher
        spaces={sampleSpaces}
        currentSpaceId="space-1"
        lang="en"
      />,
    );

    // Open dropdown
    const trigger = screen.getByLabelText("spaces.switchSpace");
    fireEvent.click(trigger);

    // Click create option
    const createOption = screen.getByText("spaces.createSpace");
    fireEvent.click(createOption);

    // Fill form
    const input = screen.getByRole("textbox", { name: "spaces.createSpace" });
    fireEvent.change(input, { target: { value: "New Space" } });

    // Submit
    const form = screen.getByRole("form", { name: "spaces.createSpace" });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith({ name: "New Space" });
    });
  });

  it("submits rename space form and calls renameSpaceAction", async () => {
    const renameSpy = vi
      .spyOn(spaceActions, "renameSpaceAction")
      .mockResolvedValue({
        ok: true,
        data: { id: "space-1", name: "Renamed Space" },
      });

    render(
      <SpaceSwitcher
        spaces={sampleSpaces}
        currentSpaceId="space-1"
        lang="en"
      />,
    );

    // Open dropdown
    const trigger = screen.getByLabelText("spaces.switchSpace");
    fireEvent.click(trigger);

    // Click rename option
    const renameOption = screen.getByText("spaces.renameSpace");
    fireEvent.click(renameOption);

    // Fill form
    const input = screen.getByRole("textbox", { name: "spaces.renameSpace" });
    fireEvent.change(input, { target: { value: "Renamed Space" } });

    // Submit
    const form = screen.getByRole("form", { name: "spaces.renameSpace" });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(renameSpy).toHaveBeenCalledWith({
        spaceId: "space-1",
        name: "Renamed Space",
      });
    });
  });
});
