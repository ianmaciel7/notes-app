import { NextResponse } from "next/server";
import { createSession, revokeCurrentSession } from "@/lib/firebase/identity";
import {
  isAllowedOrigin,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/firebase/session";

function requestOrigin(request: Request) {
  return new URL(request.url).origin;
}

function isSecureRequest(request: Request) {
  return new URL(request.url).protocol === "https:";
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin"), requestOrigin(request))) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const body: unknown = await request.json().catch(() => null);
  if (
    !body ||
    typeof body !== "object" ||
    !("idToken" in body) ||
    typeof body.idToken !== "string" ||
    body.idToken.length === 0
  ) {
    return NextResponse.json(
      { error: "Invalid session request." },
      { status: 400 },
    );
  }

  try {
    const session = await createSession(body.idToken);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      SESSION_COOKIE_NAME,
      session,
      sessionCookieOptions(isSecureRequest(request)),
    );
    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid identity token." },
      { status: 401 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin"), requestOrigin(request))) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  await revokeCurrentSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieOptions(isSecureRequest(request)),
    maxAge: 0,
  });
  return response;
}
