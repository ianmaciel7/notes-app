import "server-only";
import { cookies } from "next/headers";
import { DomainError } from "@/domain/shared/domain-error";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { verifyFirebaseSessionCookie } from "@/lib/firebase/admin";

export interface CurrentUser {
  uid: string;
  email: string | null;
}

/**
 * Reads the HttpOnly session cookie, verifies it with Firebase Admin, and
 * returns the authenticated user. Throws `DomainError("unauthenticated")` on
 * any failure — missing cookie, invalid token, revoked session, etc.
 */
export async function requireActionUser(): Promise<CurrentUser> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionCookie) {
      throw new DomainError("unauthenticated", {
        message: "No session cookie present.",
      });
    }

    const decoded = await verifyFirebaseSessionCookie(sessionCookie, true);

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
    };
  } catch (error) {
    if (error instanceof DomainError) {
      throw error;
    }
    throw new DomainError("unauthenticated", {
      message: "Session verification failed.",
    });
  }
}
