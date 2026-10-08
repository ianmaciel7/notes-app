import { describe, expect, it } from "vitest";
import { matchLocale, negotiateLocale } from "@/lib/i18n/config";

describe("matchLocale", () => {
  it.each([
    ["en", "en"],
    ["pt-BR", "pt-BR"],
    ["PT-br", "pt-BR"],
    ["pt", "pt-BR"],
    ["pt-PT", "pt-BR"],
    ["en-US", "en"],
    ["en-GB", "en"],
    ["es-MX", "es"],
    ["es-ES", "es"],
  ])("maps %s to %s", (tag, expected) => {
    expect(matchLocale(tag)).toBe(expected);
  });

  it.each(["fr", "fr-FR", "", null, undefined])("rejects %s", (tag) => {
    expect(matchLocale(tag)).toBeUndefined();
  });
});

describe("negotiateLocale", () => {
  it.each([
    ["en-US,pt-BR;q=0.9", "en"],
    ["en;q=0.5,pt;q=0.9", "pt-BR"],
    ["fr;q=0.9,es-MX;q=0.8", "es"],
    ["pt-BR;q=0,es;q=0.8", "es"],
  ])("negotiates %s to %s", (header, expected) => {
    expect(negotiateLocale(header)).toBe(expected);
  });

  it.each([
    "pt-BR;q=0,fr;q=0.8",
    "*;q=1,fr;q=0.5",
    "garbage",
    "",
    null,
    undefined,
  ])("returns undefined for %s when no supported language is usable", (header) => {
    expect(negotiateLocale(header)).toBeUndefined();
  });
});
