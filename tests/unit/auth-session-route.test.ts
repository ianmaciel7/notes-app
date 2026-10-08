import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase/identity", () => ({
  createSession: vi.fn(),
  revokeCurrentSession: vi.fn(),
}));

import { DELETE, POST } from "@/app/api/auth/session/route";
import { createSession, revokeCurrentSession } from "@/lib/firebase/identity";

function sessionRequest(
  method: "DELETE" | "POST",
  origin: string,
  body?: string,
) {
  return {
    headers: new Headers({
      ...(body ? { "Content-Type": "application/json" } : {}),
      origin,
    }),
    json: async () => JSON.parse(body ?? "null"),
    method,
    url: "http://localhost:3000/api/auth/session",
  } as unknown as Request;
}

describe("auth session route", () => {
  it("rejects a cross-origin session request", async () => {
    const response = await POST(
      sessionRequest("POST", "https://attacker.example", '{"idToken":"token"}'),
    );

    expect(response.status).toBe(403);
  });

  it("rejects malformed session requests without validating a token", async () => {
    const response = await POST(
      sessionRequest("POST", "http://localhost:3000", "{}"),
    );

    expect(response.status).toBe(400);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("rejects an invalid identity token without setting a session cookie", async () => {
    vi.mocked(createSession).mockRejectedValueOnce(new Error("Invalid token"));

    const response = await POST(
      sessionRequest("POST", "http://localhost:3000", '{"idToken":"token"}'),
    );

    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("clears the session cookie only for same-origin sign-out", async () => {
    const response = await DELETE(
      sessionRequest("DELETE", "http://localhost:3000"),
    );

    expect(response.status).toBe(200);
    expect(revokeCurrentSession).toHaveBeenCalledTimes(1);
    expect(response.headers.get("set-cookie")).toContain("__session=");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});
