import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SettingsFieldGroup } from "@/components/notes-app/settings-field-group";
import messages from "@/messages/en.json";

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

function renderFieldGroup() {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SettingsFieldGroup />
    </NextIntlClientProvider>,
  );
}

describe("SettingsFieldGroup", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockResolvedTheme = "light";
  });

  it("renders theme and language controls", () => {
    renderFieldGroup();

    expect(screen.getByRole("switch")).toBeDefined();
    expect(screen.getByTestId("language-select")).toBeDefined();
  });

  it("switches to dark theme", () => {
    renderFieldGroup();

    fireEvent.click(screen.getByRole("switch"));

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("switches back to light theme", () => {
    mockResolvedTheme = "dark";
    renderFieldGroup();

    fireEvent.click(screen.getByRole("switch"));

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
