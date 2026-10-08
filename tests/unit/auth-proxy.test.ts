import { describe, expect, it } from "vitest";
import { getAuthProxyRewrites } from "@/lib/firebase/auth-proxy";

describe("getAuthProxyRewrites", () => {
  it("proxies /__/auth to the project's firebaseapp.com helper", () => {
    const config = JSON.stringify({ projectId: "my-app-12345" });

    expect(getAuthProxyRewrites(config)).toEqual([
      {
        source: "/__/auth/:path*",
        destination: "https://my-app-12345.firebaseapp.com/__/auth/:path*",
      },
    ]);
  });

  it("returns no rewrites without a configuration", () => {
    expect(getAuthProxyRewrites(undefined)).toEqual([]);
    expect(getAuthProxyRewrites("")).toEqual([]);
  });

  it("returns no rewrites for invalid JSON", () => {
    expect(getAuthProxyRewrites("{not json")).toEqual([]);
  });

  it("returns no rewrites when projectId is missing or unsafe", () => {
    expect(getAuthProxyRewrites("{}")).toEqual([]);
    expect(getAuthProxyRewrites(JSON.stringify({ projectId: 1 }))).toEqual([]);
    expect(
      getAuthProxyRewrites(JSON.stringify({ projectId: "evil.com/x" })),
    ).toEqual([]);
  });
});
