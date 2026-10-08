export const SESSION_COOKIE_NAME = "__session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;

const PROTECTED_ROUTE_PREFIXES = ["/dashboard", "/settings"];

export function isProtectedPath(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isAllowedOrigin(origin: string | null, expectedOrigin: string) {
  return origin === expectedOrigin;
}

export function sessionCookieOptions(isSecure: boolean) {
  return {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: isSecure,
  };
}
