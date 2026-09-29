import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CreateSpaceForm } from "./create-space-form";

describe("CreateSpaceForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders when open and handles space creation submission", async () => {
    const onOpenChange = vi.fn();
    const onSubmitSpace = vi.fn().mockResolvedValue(undefined);

    const { unmount } = render(
      <CreateSpaceForm
        open={true}
        onOpenChange={onOpenChange}
        onSubmitSpace={onSubmitSpace}
      />,
    );

    expect(screen.getByTestId("create-space-form")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Create Space" })).toBeDefined();

    const nameInput = screen.getByTestId("space-name-input");
    const bookIconBtn = screen.getByTestId("icon-btn-book");
    const submitBtn = screen.getByTestId("submit-create-space");

    fireEvent.change(nameInput, { target: { value: "Engineering Notes" } });
    fireEvent.click(bookIconBtn);
    fireEvent.click(submitBtn);

    expect(onSubmitSpace).toHaveBeenCalledWith("Engineering Notes", "book");
    unmount();
  });

  it("shows error if submitting with empty name", async () => {
    const onOpenChange = vi.fn();
    const onSubmitSpace = vi.fn();

    const { unmount } = render(
      <CreateSpaceForm
        open={true}
        onOpenChange={onOpenChange}
        onSubmitSpace={onSubmitSpace}
      />,
    );

    const nameInput = screen.getByTestId("space-name-input");
    const submitBtn = screen.getByTestId("submit-create-space");

    fireEvent.change(nameInput, { target: { value: "   " } });
    fireEvent.click(submitBtn);

    expect(onSubmitSpace).not.toHaveBeenCalled();
    unmount();
  });
});
