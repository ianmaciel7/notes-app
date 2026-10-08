export const themes = ["light", "dark", "system"] as const;

export type Theme = (typeof themes)[number];

export const themeStorageKey = "theme";

export function parseTheme(value: unknown): Theme {
  return themes.find((theme) => theme === value) ?? "system";
}

export function createThemeScript(storageKey: string): string {
  // Runs before first paint (ADR 0009). "system" leaves the root class-free so
  // globals.css follows prefers-color-scheme; "light" and "dark" force .light
  // and .dark. Mirrors applyTheme() in theme.tsx.
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)});var c=document.documentElement.classList;if(t==="dark"||t==="light"){c.remove("dark","light");c.add(t)}}catch(e){}})()`;
}
