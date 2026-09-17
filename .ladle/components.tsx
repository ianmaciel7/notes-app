import "../src/app/globals.css";

import type { ReactNode } from "react";

export const GlobalProvider = ({ children }: { children: ReactNode }) => (
  <div style={{ width: "100%", height: "100%" }}>{children}</div>
);
