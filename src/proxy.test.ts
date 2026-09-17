import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { proxy } from "./proxy";

describe("proxy", () => {
  it("redirects an unprefixed route to the negotiated locale", () => {
    const response = proxy(
      new NextRequest("https://notes.example.test/settings", {
        headers: { "accept-language": "pt-BR,pt;q=0.9,en;q=0.8" },
      }),
    );

    expect(response.headers.get("location")).toBe(
      "https://notes.example.test/pt-BR/settings",
    );
  });

  it("falls back to English when no supported locale is negotiated", () => {
    const response = proxy(
      new NextRequest("https://notes.example.test/", {
        headers: { "accept-language": "fr-CA,fr;q=0.9" },
      }),
    );

    expect(response.headers.get("location")).toBe(
      "https://notes.example.test/en/",
    );
  });

  it("leaves supported locale routes unchanged", () => {
    const response = proxy(new NextRequest("https://notes.example.test/en"));

    expect(response.headers.get("location")).toBeNull();
  });
});
