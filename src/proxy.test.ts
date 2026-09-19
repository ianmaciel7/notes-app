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
    expect(response.cookies.get("NEXT_LOCALE")?.value).toBe("en");
    expect(response.headers.get("x-middleware-request-x-next-locale")).toBe(
      "en",
    );
  });

  it("prefers a valid locale cookie over Accept-Language", () => {
    const response = proxy(
      new NextRequest("https://notes.example.test/settings", {
        headers: {
          cookie: "NEXT_LOCALE=pt-BR",
          "accept-language": "en-US,en;q=0.9",
        },
      }),
    );

    expect(response.headers.get("location")).toBe(
      "https://notes.example.test/pt-BR/settings",
    );
    expect(response.cookies.get("NEXT_LOCALE")?.value).toBe("pt-BR");
  });

  it("ignores an invalid locale cookie", () => {
    const response = proxy(
      new NextRequest("https://notes.example.test/settings", {
        headers: {
          cookie: "NEXT_LOCALE=fr",
          "accept-language": "pt-BR",
        },
      }),
    );

    expect(response.headers.get("location")).toBe(
      "https://notes.example.test/pt-BR/settings",
    );
    expect(response.cookies.get("NEXT_LOCALE")?.value).toBe("pt-BR");
  });

  it("writes a one-year root locale cookie", () => {
    const response = proxy(new NextRequest("https://notes.example.test/en"));
    const setCookie = response.headers.get("set-cookie");

    expect(setCookie).toContain("NEXT_LOCALE=en");
    expect(setCookie).toContain("Max-Age=31536000");
    expect(setCookie).toContain("Path=/");
    expect(setCookie).toContain("SameSite=lax");
  });

  describe("authenticated routes with canonical locale prefixing", () => {
    it("redirects authenticated user on unprefixed root / to negotiated locale", () => {
      const response = proxy(
        new NextRequest("https://notes.example.test/", {
          headers: {
            cookie: "firebase_session=valid_token; NEXT_LOCALE=pt-BR",
          },
        }),
      );

      expect(response.headers.get("location")).toBe(
        "https://notes.example.test/pt-BR",
      );
    });

    it("leaves authenticated user on /[lang] unchanged", () => {
      const response = proxy(
        new NextRequest("https://notes.example.test/pt-BR/spaces", {
          headers: {
            cookie: "firebase_session=valid_token",
          },
        }),
      );

      expect(response.headers.get("location")).toBeNull();
      expect(response.cookies.get("NEXT_LOCALE")?.value).toBe("pt-BR");
    });
  });
});
