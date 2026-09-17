import "../src/app/globals.css";

import type { ReactNode } from "react";

import { ThemeProvider } from "../src/components/theme-provider";

export const GlobalProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <div style={{ width: "100%", height: "100%" }}>{children}</div>
  </ThemeProvider>
);
