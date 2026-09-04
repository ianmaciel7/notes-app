import type { GlobalProvider } from "@ladle/react";
import * as React from "react";
import "../src/app/globals.css";

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
    <div
      className={`font-sans antialiased bg-background text-foreground min-h-screen p-6 ${
        isDark ? "dark" : ""
      }`}
    >
      {children}
    </div>
  );
};
