import { describe, expect, it, vi } from "vitest";

import { deleteSession, syncSession } from "./client-session";

describe("syncSession", () => {
  it("creates the server session from the Firebase ID token", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 200 }));

    await expect(syncSession("id-token", fetcher)).resolves.toBe(true);

    expect(fetcher).toHaveBeenCalledWith("/api/session", {
      method: "POST",
      headers: { Authorization: "Bearer id-token" },
    });
  });

  it("reports a rejected server session without redirecting", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 401 }));

    await expect(syncSession("expired-token", fetcher)).resolves.toBe(false);
  });
});

describe("deleteSession", () => {
  it("deletes the server session", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 200 }));

    await expect(deleteSession(fetcher)).resolves.toBe(true);

    expect(fetcher).toHaveBeenCalledWith("/api/session", {
      method: "DELETE",
    });
  });

  it("handles failure response when deleting server session", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 500 }));

    await expect(deleteSession(fetcher)).resolves.toBe(false);
  });
});
