import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE } from "@/lib/auth/session";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { localePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/types";

export type CurrentUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export async function getCurrentUser(locale: Locale): Promise<CurrentUser> {
  "use cache: private";

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect(localePath(locale, "/sign-in"));

  try {
    const decoded = await verifyFirebaseIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      displayName: decoded.name ?? null,
    };
  } catch {
    redirect(localePath(locale, "/sign-in"));
  }
}
