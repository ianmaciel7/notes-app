import "server-only";

export const SESSION_COOKIE = "firebase_session";

export const SESSION_COOKIE_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 5;
export const SESSION_COOKIE_EXPIRES_IN_MS =
  SESSION_COOKIE_EXPIRES_IN_SECONDS * 1000;
export const SESSION_CACHE_TAG = "user-session";

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_COOKIE_EXPIRES_IN_SECONDS,
};
