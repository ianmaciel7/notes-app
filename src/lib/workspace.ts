import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { snapshot } from "@/actions/recall";
import type { Snapshot } from "@/domain/recall";

// Shared by every /workspace, /question, /study, /review page: resolves the
// caller's session and active Space in one place instead of duplicating the
// try/redirect in each Server Component.
export async function requireSnapshot(): Promise<Snapshot> {
  const selected = (await cookies()).get("recall-space")?.value ?? "";
  try {
    return await snapshot(selected);
  } catch {
    redirect("/login");
  }
}
