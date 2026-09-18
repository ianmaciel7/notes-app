import { revalidateTag, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  SESSION_CACHE_TAG,
  SESSION_COOKIE,
  SESSION_COOKIE_EXPIRES_IN_MS,
  sessionCookieOptions,
} from "@/lib/auth/session";
import {
  createFirebaseSessionCookie,
  revokeFirebaseUserSessions,
  verifyFirebaseSessionCookie,
} from "@/lib/firebase/admin";

function isValidOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0].trim() ??
    request.headers.get("host");

  if (!host) {
    return false;
  }

  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  return false;
}

function invalidateCacheTag(tag: string) {
  try {
    updateTag(tag);
  } catch {
    revalidateTag(tag, { expire: 0 });
  }
}

export async function POST(request: Request) {
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    return NextResponse.json(
      { error: "Missing bearer token" },
      { status: 401 },
    );
  }

  let sessionCookie: string;
  try {
    sessionCookie = await createFirebaseSessionCookie(
      token,
      SESSION_COOKIE_EXPIRES_IN_MS,
    );
  } catch (error) {
    console.error("Failed to create Firebase session cookie:", error);
    return NextResponse.json(
      { error: "Invalid bearer token" },
      { status: 401 },
    );
  }

  (await cookies()).set(SESSION_COOKIE, sessionCookie, sessionCookieOptions);
  invalidateCacheTag(SESSION_CACHE_TAG);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionCookie) {
    try {
      const decoded = await verifyFirebaseSessionCookie(sessionCookie, false);
      await revokeFirebaseUserSessions(decoded.uid);
      invalidateCacheTag(SESSION_CACHE_TAG);
      invalidateCacheTag(`user-${decoded.uid}`);
    } catch {
      invalidateCacheTag(SESSION_CACHE_TAG);
    }
  }

  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
