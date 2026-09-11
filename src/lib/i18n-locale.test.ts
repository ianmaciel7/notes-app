import { describe, expect, it } from "vitest";
import {
  defaultLocale,
  isSupportedLocale,
  resolveBrowserLocale,
  resolveServerLocale,
} from "./i18n-locale";

describe("i18n-locale", () => {
  it("defaults to pt-BR", () => {
    expect(defaultLocale).toBe("pt-BR");
  });

  it("validates supported locales", () => {
    expect(isSupportedLocale("pt-BR")).toBe(true);
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("fr")).toBe(false);
  });

  it("resolves server locale fallback correctly", () => {
    expect(resolveServerLocale("en")).toBe("en");
    expect(resolveServerLocale("invalid")).toBe("pt-BR");
    expect(resolveServerLocale(null)).toBe("pt-BR");
  });

  it("resolves browser locale priority", () => {
    expect(
      resolveBrowserLocale({
        cookieLocale: "en",
        fallbackLocale: "pt-BR",
        storedLocale: "pt-BR",
      }),
    ).toBe("pt-BR");

    expect(
      resolveBrowserLocale({
        cookieLocale: "en",
        fallbackLocale: "pt-BR",
        storedLocale: null,
      }),
    ).toBe("en");
  });
});
