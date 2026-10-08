"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useSyncExternalStore,
} from "react";
import { parseTheme, type Theme, themeStorageKey } from "./theme-script";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function readTheme(): Theme {
  try {
    return parseTheme(localStorage.getItem(themeStorageKey));
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  const classList = document.documentElement.classList;
  classList.remove("dark", "light");
  if (theme !== "system") {
    classList.add(theme);
  }
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function setStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Storage can be blocked; the class below still applies for this page.
  }
  applyTheme(theme);
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key === null || event.key === themeStorageKey) {
      applyTheme(readTheme());
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getServerTheme(): Theme {
  return "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerTheme);

  return (
    <ThemeContext value={{ theme, setTheme: setStoredTheme }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
