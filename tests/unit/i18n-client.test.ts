import { beforeEach, describe, expect, it, vi } from "vitest";

const setLocalePreference = vi.hoisted(() => vi.fn(async () => undefined));

vi.mock("@/lib/i18n/actions", () => ({ setLocalePreference }));

import {
  applyAuthLocale,
  changeLocalePreference,
  readLocaleCookie,
  resolveClientLocale,
} from "@/lib/i18n/client";
import { getFirebaseUiLocale } from "@/lib/i18n/firebase-ui-locale";

describe("i18n client helpers", () => {
  beforeEach(() => {
    document.cookie = "NEXT_LOCALE=; Max-Age=0";
    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: ["en-US"],
    });
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "en-US",
    });
  });

  it("reads the locale cookie and rejects encoded unsupported values", () => {
    document.cookie = "NEXT_LOCALE=pt-BR%3Dignored";
    expect(readLocaleCookie()).toBeUndefined();

    document.cookie = "NEXT_LOCALE=pt-BR";
    expect(readLocaleCookie()).toBe("pt-BR");
  });

  it("prefers the cookie over automatic detection", () => {
    document.cookie = "NEXT_LOCALE=es";
    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: ["pt-BR"],
    });
    expect(resolveClientLocale()).toBe("es");
  });

  it("negotiates browser languages without persisting them", () => {
    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: ["pt", "en-US"],
    });
    expect(resolveClientLocale()).toBe("pt-BR");
    expect(readLocaleCookie()).toBeUndefined();
  });

  it("falls back to navigator.language and then the default", () => {
    Object.defineProperty(navigator, "languages", {
      configurable: true,
      value: [],
    });
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "es-MX",
    });
    expect(resolveClientLocale()).toBe("es");

    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "de-DE",
    });
    expect(resolveClientLocale()).toBe("en");
  });

  it("applies the locale to Firebase Auth and Firebase UI", () => {
    const auth = { languageCode: undefined as string | undefined };
    const ui = { setLocale: vi.fn() };

    applyAuthLocale(auth as never, ui, "es");

    expect(auth.languageCode).toBe("es");
    expect(ui.setLocale).toHaveBeenCalledWith(getFirebaseUiLocale("es"));
  });

  it("persists the choice, then updates Firebase Auth and the html lang", async () => {
    const auth = { languageCode: undefined as string | undefined };
    const ui = { setLocale: vi.fn() };

    await changeLocalePreference(auth as never, ui, "pt-BR");

    expect(setLocalePreference).toHaveBeenCalledWith("pt-BR");
    expect(auth.languageCode).toBe("pt-BR");
    expect(ui.setLocale).toHaveBeenCalledWith(getFirebaseUiLocale("pt-BR"));
    expect(document.documentElement.lang).toBe("pt-BR");
  });
});
