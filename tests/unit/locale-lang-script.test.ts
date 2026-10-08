import { describe, expect, it } from "vitest";
import { createLocaleLangScript } from "@/components/notes-app/locale-lang-script";
import { defaultLocale, locales } from "@/lib/i18n/config";

function runLocaleLangScript({
  cookie = "",
  language = "",
  languages,
}: {
  cookie?: string;
  language?: string;
  languages: string[];
}) {
  document.cookie =
    "NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  if (cookie) {
    document.cookie = `${cookie}; path=/`;
  }
  Object.defineProperty(navigator, "languages", {
    configurable: true,
    value: languages,
  });
  Object.defineProperty(navigator, "language", {
    configurable: true,
    value: language,
  });
  document.documentElement.lang = defaultLocale;

  new Function(createLocaleLangScript(locales, defaultLocale))();

  return document.documentElement.lang;
}

describe("createLocaleLangScript", () => {
  it("prefers a supported cookie locale", () => {
    expect(
      runLocaleLangScript({ cookie: "NEXT_LOCALE=es", languages: ["en-US"] }),
    ).toBe("es");
  });

  it("falls back from browser language to its supported primary locale", () => {
    expect(runLocaleLangScript({ languages: ["pt", "es-MX"] })).toBe("pt-BR");
  });

  it("uses the default locale when cookie and browser languages do not match", () => {
    expect(runLocaleLangScript({ languages: ["fr-FR"] })).toBe(defaultLocale);
  });

  it("falls back to navigator.language when navigator.languages is empty", () => {
    expect(runLocaleLangScript({ language: "es-MX", languages: [] })).toBe(
      "es",
    );
  });

  it("ignores a malformed cookie and keeps resolving browser languages", () => {
    expect(
      runLocaleLangScript({
        cookie: "NEXT_LOCALE=%E0%A4%A",
        languages: ["es-MX"],
      }),
    ).toBe("es");
  });

  it("ignores a non-exact cookie value like the client resolver", () => {
    expect(
      runLocaleLangScript({ cookie: "NEXT_LOCALE=pt", languages: ["es"] }),
    ).toBe("es");
  });
});
