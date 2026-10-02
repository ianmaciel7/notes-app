import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SettingsDialog,
  SettingsDialogContent,
} from "@/components/notes-app/settings-dialog";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function renderDialog(open = true, onOpenChange = vi.fn()) {
  render(
    <SettingsDialog open={open} onOpenChange={onOpenChange}>
      <SettingsDialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Preferences</DialogDescription>
        </DialogHeader>
      </SettingsDialogContent>
    </SettingsDialog>,
  );

  return onOpenChange;
}

describe("SettingsDialog", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders nothing while closed", () => {
    renderDialog(false);

    expect(screen.queryByTestId("settings-dialog")).toBeNull();
  });

  it("renders caller-provided children while open", () => {
    renderDialog();

    expect(screen.getByTestId("settings-dialog")).toBeDefined();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeDefined();
    expect(screen.getByText("Preferences")).toBeDefined();
  });
});
