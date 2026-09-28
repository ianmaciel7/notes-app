import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import messages from "@/messages/en.json";
import { LanguageSwitcher } from "./language-switcher";

const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

function renderWithIntl(ui: React.ReactNode, locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("LanguageSwitcher", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders language select dropdown with supported options", () => {
    renderWithIntl(<LanguageSwitcher />);

    const select = screen.getByTestId("language-select") as HTMLSelectElement;
    expect(select).toBeDefined();
    expect(select.value).toBe("en");
    expect(screen.getByText("English")).toBeDefined();
    expect(screen.getByText("Português (Brasil)")).toBeDefined();
    expect(screen.getByText("Español")).toBeDefined();
  });

  it("triggers router refresh on language selection", () => {
    renderWithIntl(<LanguageSwitcher />);

    const select = screen.getByTestId("language-select");
    fireEvent.change(select, { target: { value: "pt-BR" } });

    expect(mockRefresh).toHaveBeenCalled();
  });
});
