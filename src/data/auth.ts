import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_CACHE_TAG, SESSION_COOKIE } from "@/lib/auth/session";
import { verifyFirebaseSessionCookie } from "@/lib/firebase/admin";
import { localePath } from "@/lib/i18n/routing";
import {
  defaultLocale,
  hasLocale,
  type Locale,
  localeCookieName,
} from "@/lib/i18n/types";

export type CurrentUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export async function getCurrentUser(locale?: Locale): Promise<CurrentUser> {
  "use cache: private";
  cacheLife({ stale: 60 });
  cacheTag(SESSION_CACHE_TAG);

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  const rawLocale = cookieStore.get(localeCookieName)?.value;
  const resolvedLocale: Locale =
    locale ?? (hasLocale(rawLocale) ? rawLocale : defaultLocale);

  if (!sessionCookie) redirect(localePath(resolvedLocale, "/sign-in"));

  try {
    const decoded = await verifyFirebaseSessionCookie(sessionCookie, true);
    cacheTag(`user-${decoded.uid}`);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      displayName: decoded.name ?? null,
    };
  } catch (error) {
    console.error(
      "Session verification failed, redirecting to sign-in:",
      error,
    );
    redirect(localePath(resolvedLocale, "/sign-in?expired=true"));
  }
}
