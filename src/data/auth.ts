import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_CACHE_TAG, SESSION_COOKIE } from "@/lib/auth/session";
import { verifyFirebaseSessionCookie } from "@/lib/firebase/admin";
import { localePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/types";

export type CurrentUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export async function getCurrentUser(locale: Locale): Promise<CurrentUser> {
  "use cache: private";
  cacheLife({ stale: 60 });
  cacheTag(SESSION_CACHE_TAG);

  const sessionCookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionCookie) redirect(localePath(locale, "/sign-in"));

  try {
    const decoded = await verifyFirebaseSessionCookie(sessionCookie, true);
    cacheTag(`user-${decoded.uid}`);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      displayName: decoded.name ?? null,
    };
  } catch {
    redirect(localePath(locale, "/sign-in"));
  }
}
