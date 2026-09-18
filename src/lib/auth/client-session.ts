export async function syncSession(
  idToken: string,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const response = await fetcher("/api/session", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
  });

  return response.ok;
}

export async function deleteSession(
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const response = await fetcher("/api/session", {
    method: "DELETE",
  });

  return response.ok;
}
