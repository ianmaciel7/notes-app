import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { config, proxy } from "./proxy";

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

  it("preserves query strings when redirecting to a locale route", () => {
    const response = proxy(
      new NextRequest("https://notes.example.test/settings?tab=profile"),
    );

    expect(response.headers.get("location")).toBe(
      "https://notes.example.test/en/settings?tab=profile",
    );
  });

  it("matches a language-only Portuguese preference to pt-BR", () => {
    const response = proxy(
      new NextRequest("https://notes.example.test/", {
        headers: { "accept-language": "pt,en;q=0.8" },
      }),
    );

    expect(response.headers.get("location")).toBe(
      "https://notes.example.test/pt-BR",
    );
  });

  it("excludes API, Next internals, and static files from the matcher", () => {
    for (const url of [
      "https://notes.example.test/api/session",
      "https://notes.example.test/_next/static/app.js",
      "https://notes.example.test/favicon.ico",
    ]) {
      expect(
        unstable_doesMiddlewareMatch({
          config,
          nextConfig: {} as never,
          url,
        }),
      ).toBe(false);
    }
  });

  it("falls back to English when no supported locale is negotiated", () => {
    const response = proxy(
      new NextRequest("https://notes.example.test/", {
        headers: { "accept-language": "fr-CA,fr;q=0.9" },
      }),
    );

    expect(response.headers.get("location")).toBe(
      "https://notes.example.test/en",
    );
  });

  it("leaves supported locale routes unchanged", () => {
    const response = proxy(new NextRequest("https://notes.example.test/en"));

    expect(response.headers.get("location")).toBeNull();
  });
});
