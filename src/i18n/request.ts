import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "./routing";

const editorMessagesByLocale = {
  en: () => import("../messages/editor/en.json").then((module) => module.default),
  es: () => import("../messages/editor/es.json").then((module) => module.default),
  "pt-BR": () =>
    import("../messages/editor/pt-BR.json").then((module) => module.default),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const supportedLocale = locale as keyof typeof editorMessagesByLocale;
  const [messages, editorMessages] = await Promise.all([
    import(`../messages/${supportedLocale}.json`).then((module) => module.default),
    editorMessagesByLocale[supportedLocale](),
  ]);

  return {
    locale: supportedLocale,
    messages: {
      ...messages,
      workspace: {
        ...messages.workspace,
        editor: {
          ...messages.workspace.editor,
          ...editorMessages,
        },
      },
    },
  };
});
