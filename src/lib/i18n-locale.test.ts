import { expect, it } from "vitest";

import {
  buildLocaleCookie,
  defaultLocale,
  getLocalePersistenceAction,
  localeCookieName,
  localeStorageKey,
  resolveServerLocale,
} from "@/lib/i18n-locale";

it("uses a valid cookie locale for server rendering", () => {
  expect(resolveServerLocale("en")).toBe("en");
  expect(resolveServerLocale("es")).toBe("es");
  expect(resolveServerLocale("pt-BR")).toBe("pt-BR");
});

it("falls back to Brazilian Portuguese for invalid or missing server locales", () => {
  expect(defaultLocale).toBe("pt-BR");
  expect(resolveServerLocale(undefined)).toBe("pt-BR");
  expect(resolveServerLocale("fr")).toBe("pt-BR");
});

it("lets browser storage win and requests a cookie refresh when it differs from the server locale", () => {
  expect(
    getLocalePersistenceAction({
      cookieLocale: "en",
      serverLocale: "en",
      storedLocale: "pt-BR",
    }),
  ).toEqual({
    locale: "pt-BR",
    shouldReload: true,
    shouldWriteCookie: true,
    shouldWriteStorage: false,
  });
});

it("backfills browser storage from the cookie-backed server locale", () => {
  expect(
    getLocalePersistenceAction({
      cookieLocale: "es",
      serverLocale: "es",
      storedLocale: null,
    }),
  ).toEqual({
    locale: "es",
    shouldReload: false,
    shouldWriteCookie: false,
    shouldWriteStorage: true,
  });
});

it("serializes the app locale cookie with the expected browser persistence settings", () => {
  expect(localeCookieName).toBe("NEXT_LOCALE");
  expect(localeStorageKey).toBe("notes-app-locale");
  expect(buildLocaleCookie("pt-BR")).toBe(
    "NEXT_LOCALE=pt-BR; Path=/; Max-Age=31536000; SameSite=Lax",
  );
});
