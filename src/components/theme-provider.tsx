"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
};

const STORAGE_KEY = "notes-app-theme";

const ThemeProviderContext = React.createContext<ThemeProviderContextType>({
  theme: "system",
  setTheme: () => null,
  isDark: false,
  toggleTheme: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [isDark, setIsDark] = React.useState<boolean>(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system") {
      setThemeState(savedTheme);
    }
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const effectiveIsDark = theme === "dark" || (theme === "system" && systemDark);

      setIsDark(effectiveIsDark);
      if (effectiveIsDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setTheme = React.useCallback((newTheme: Theme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "L" || e.key === "l")) {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      isDark,
      toggleTheme,
    }),
    [theme, setTheme, isDark, toggleTheme],
  );

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

export function useTheme() {
  return React.useContext(ThemeProviderContext);
}
