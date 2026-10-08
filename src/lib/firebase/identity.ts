import "server-only";

import { io } from "next/cache";
import { cookies } from "next/headers";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/firebase/session";

export type Identity = {
  email: string | null;
  uid: string;
};

const MAX_AUTH_AGE_SECONDS = 5 * 60;

export async function createSession(idToken: string) {
  const auth = getFirebaseAdminAuth();
  const decodedToken = await auth.verifyIdToken(idToken);
  const now = Math.floor(Date.now() / 1000);

  if (
    !decodedToken.auth_time ||
    now - decodedToken.auth_time > MAX_AUTH_AGE_SECONDS
  ) {
    throw new Error("Recent authentication is required.");
  }

  return auth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
  });
}

// Revokes the user's refresh tokens so the session cookie stops verifying.
// Best effort: an already invalid cookie must not block signing out.
export async function revokeCurrentSession() {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return;
  }

  try {
    const auth = getFirebaseAdminAuth();
    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    await auth.revokeRefreshTokens(decodedToken.sub);
  } catch {
    // Nothing to revoke.
  }
}

export async function getCurrentIdentity(): Promise<Identity | null> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return null;
  }

  // verifySessionCookie reads the current time; keep it out of prerendering.
  await io();

  try {
    const decodedToken = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    );
    return { email: decodedToken.email ?? null, uid: decodedToken.uid };
  } catch {
    return null;
  }
}
