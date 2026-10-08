import { beforeEach, describe, expect, it } from "vitest";
import {
  createThemeScript,
  parseTheme,
  themeStorageKey,
} from "@/lib/theme/theme-script";

function runThemeScript(stored: string | null, initialClass = "") {
  localStorage.clear();
  if (stored !== null) {
    localStorage.setItem(themeStorageKey, stored);
  }
  document.documentElement.className = initialClass;

  new Function(createThemeScript(themeStorageKey))();

  return document.documentElement.className;
}

describe("parseTheme", () => {
  it("accepts supported themes and falls back to system", () => {
    expect(parseTheme("dark")).toBe("dark");
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("system")).toBe("system");
    expect(parseTheme("sepia")).toBe("system");
    expect(parseTheme(null)).toBe("system");
  });
});

describe("createThemeScript", () => {
  beforeEach(() => {
    document.documentElement.className = "";
  });

  it("forces .dark for a stored dark theme", () => {
    expect(runThemeScript("dark")).toBe("dark");
  });

  it("forces .light for a stored light theme and drops a stale .dark", () => {
    expect(runThemeScript("light", "dark")).toBe("light");
  });

  it("leaves the root unforced for system or an invalid value", () => {
    expect(runThemeScript("system")).toBe("");
    expect(runThemeScript("sepia")).toBe("");
    expect(runThemeScript(null)).toBe("");
  });

  it("keeps unrelated root classes", () => {
    expect(runThemeScript("dark", "h-full antialiased")).toBe(
      "h-full antialiased dark",
    );
  });

  it("does not throw when storage is unavailable", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("blocked");
      },
    });
    try {
      expect(() =>
        new Function(createThemeScript(themeStorageKey))(),
      ).not.toThrow();
    } finally {
      if (original) {
        Object.defineProperty(window, "localStorage", original);
      }
    }
  });
});
