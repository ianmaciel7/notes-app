import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "es", "pt-BR"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const editorMessagesByLocale = {
  en: () => import("../messages/editor/en.json").then((m) => m.default),
  es: () => import("../messages/editor/es.json").then((m) => m.default),
  "pt-BR": () => import("../messages/editor/pt-BR.json").then((m) => m.default),
} as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = locales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : defaultLocale;

  const [messages, editorMessages] = await Promise.all([
    import(`../messages/${locale}.json`).then((m) => m.default),
    editorMessagesByLocale[locale](),
  ]);

  return {
    locale,
    messages: {
      ...messages,
      workspace: {
        ...messages.workspace,
        editor: {
          ...messages.workspace?.editor,
          ...editorMessages,
        },
      },
    },
  };
});
