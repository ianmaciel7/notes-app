import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SettingsDialog } from "@/components/notes-app/settings-dialog";
import messages from "@/messages/en.json";

vi.mock("@/components/notes-app/settings-form", () => ({
  SettingsForm: () => <div data-testid="settings-form" />,
}));

function renderDialog(open = true, onOpenChange = vi.fn()) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SettingsDialog open={open} onOpenChange={onOpenChange} />
    </NextIntlClientProvider>,
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

  it("renders its settings surface while open", () => {
    renderDialog();

    expect(screen.getByTestId("settings-dialog")).toBeDefined();
    expect(screen.getByTestId("settings-form")).toBeDefined();
    expect(screen.getByRole("button")).toBeDefined();
  });
});
