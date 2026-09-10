import type { GlobalProvider } from "@ladle/react";
import { NextIntlClientProvider } from "next-intl";
import * as React from "react";
import editorMessages from "../src/messages/editor/en.json";
import messages from "../src/messages/en.json";
import "../src/app/globals.css";

const ladleMessages = {
  ...messages,
  workspace: {
    ...messages.workspace,
    editor: {
      ...messages.workspace.editor,
      ...editorMessages,
    },
  },
};

export const Provider: GlobalProvider = ({ children, globalState }) => {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const theme = globalState.theme;
    if (theme === "dark") {
      setIsDark(true);
    } else if (theme === "light") {
      setIsDark(false);
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, [globalState.theme]);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <NextIntlClientProvider locale="en" messages={ladleMessages}>
      <div
        className={`font-sans antialiased bg-background text-foreground min-h-screen ${
          isDark ? "dark" : ""
        }`}
      >
        {children}
      </div>
    </NextIntlClientProvider>
  );
};
