import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import type { UserDTO } from "./dtos";
import { ForbiddenError, UnauthorizedError } from "./errors";

export const AUTH_COOKIE_NAME = "notes_app_session";

export const DEV_DEFAULT_USER: UserDTO = {
  id: "user-local-01",
  accountId: "local-account",
  name: "Local Architect",
  email: "architect@local.test",
  role: "admin",
};

/**
 * Request-scoped user resolution memoized via React.cache().
 * Deduplicates cookie decoding and session validation across layout, page, and server components.
 */
export const getCurrentUser = cache(async (): Promise<UserDTO | null> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      if (process.env.NODE_ENV !== "production") {
        return DEV_DEFAULT_USER;
      }
      return null;
    }

    const parsed = JSON.parse(sessionCookie) as Partial<UserDTO>;
    if (!parsed.id || !parsed.accountId) {
      return null;
    }

    return {
      id: parsed.id,
      accountId: parsed.accountId,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role === "admin" ? "admin" : "user",
    };
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return DEV_DEFAULT_USER;
    }
    return null;
  }
});

export async function requireCurrentUser(): Promise<UserDTO> {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}

export function assertSpaceAccess(viewer: UserDTO, spaceOwnerAccountId: string): void {
  if (viewer.role === "admin") return;
  if (viewer.accountId !== spaceOwnerAccountId) {
    throw new ForbiddenError("Viewer account does not have access to this space.");
  }
}
