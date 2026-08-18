import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es", "pt-BR"] as const;

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});
