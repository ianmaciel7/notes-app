/** The HttpOnly server session must be cleared before client sign-out. */
export async function clearServerSession(): Promise<void> {
  const response = await fetch("/api/auth/session", { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Could not clear the server session.");
  }
}
