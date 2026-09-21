import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { snapshot } from "@/actions/recall";
import type { RecallObject, Snapshot } from "@/domain/recall";
import { parseTabs, tabsCookie } from "@/domain/tabs";

export type SpaceData = Snapshot & { tabs: RecallObject[] };

// Shared by every /space, /question, /study, /review page: resolves the
// caller's session and active Space in one place instead of duplicating the
// try/redirect in each Server Component.
export async function requireSnapshot(): Promise<SpaceData> {
  const jar = await cookies();
  const selected = jar.get("recall-space")?.value ?? "";
  let data: Snapshot;
  try {
    data = await snapshot(selected);
  } catch {
    // Not a plain redirect("/login"): proxy.ts only checks cookie presence,
    // so an invalid-but-still-present recall-session cookie would bounce
    // straight back to /space, looping forever. Clear it first.
    redirect("/api/auth/clear-session");
  }
  // Resolving tabs server-side keeps the strip in the first paint, so opening
  // an object does not shift the page once the client hydrates.
  const open = parseTabs(jar.get(tabsCookie)?.value);
  const byId = new Map(data.objects.map((object) => [object.id, object]));
  return {
    ...data,
    tabs: open
      .map((id) => byId.get(id))
      .filter((object): object is RecallObject => Boolean(object)),
  };
}
