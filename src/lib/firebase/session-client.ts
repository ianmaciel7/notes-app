/** Exchanges a fresh ID token for the HttpOnly server session cookie. */
export async function createServerSession(idToken: string): Promise<void> {
  const response = await fetch("/api/auth/session", {
    body: JSON.stringify({ idToken }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to establish a server session.");
  }
}

/** The HttpOnly server session must be cleared before client sign-out. */
export async function clearServerSession(): Promise<void> {
  const response = await fetch("/api/auth/session", { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Could not clear the server session.");
  }
}
