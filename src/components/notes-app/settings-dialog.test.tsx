import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import messages from "@/messages/en.json";
import {
  SettingsDialog,
  SettingsDialogContent,
  SettingsDialogFieldGroup,
  SettingsDialogFooter,
  SettingsDialogHeader,
} from "./settings-dialog";

const mockSetTheme = vi.fn();
let mockResolvedTheme = "light";
vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

function renderDialog(open = true, onOpenChange = vi.fn()) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SettingsDialog open={open} onOpenChange={onOpenChange}>
        <SettingsDialogContent>
          <SettingsDialogHeader />
          <SettingsDialogFieldGroup />
          <SettingsDialogFooter onDone={() => onOpenChange(false)} />
        </SettingsDialogContent>
      </SettingsDialog>
    </NextIntlClientProvider>,
  );
  return onOpenChange;
}

describe("SettingsDialog", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockResolvedTheme = "light";
  });

  it("renders nothing while closed", () => {
    renderDialog(false);

    expect(screen.queryByTestId("settings-dialog")).toBeNull();
  });

  it("shows the theme switch and language select when open", () => {
    renderDialog();

    expect(screen.getByTestId("settings-dialog")).toBeDefined();
    expect(screen.getByRole("switch")).toBeDefined();
    expect(screen.getByTestId("language-select")).toBeDefined();
  });

  it("switches to dark theme from the switch", () => {
    renderDialog();

    fireEvent.click(screen.getByRole("switch"));

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("switches back to light theme when dark is active", () => {
    mockResolvedTheme = "dark";
    renderDialog();

    fireEvent.click(screen.getByRole("switch"));

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("closes from the done button", () => {
    const onOpenChange = renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Done" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
