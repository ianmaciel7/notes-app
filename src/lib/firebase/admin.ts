import "server-only";

import { getApps, initializeApp } from "firebase-admin/app";
import { type DecodedIdToken, getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "demo-notes-app";

if (process.env.NODE_ENV === "development") {
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";
}

const adminApp = getApps()[0] ?? initializeApp({ projectId });

export const adminAuth = getAuth(adminApp);

export async function verifyFirebaseIdToken(idToken: string) {
  return adminAuth.verifyIdToken(idToken);
}

export async function createFirebaseSessionCookie(
  idToken: string,
  expiresIn: number,
): Promise<string> {
  return adminAuth.createSessionCookie(idToken, { expiresIn });
}

export async function verifyFirebaseSessionCookie(
  sessionCookie: string,
  checkRevoked = true,
): Promise<DecodedIdToken> {
  return adminAuth.verifySessionCookie(sessionCookie, checkRevoked);
}

export async function revokeFirebaseUserSessions(uid: string): Promise<void> {
  await adminAuth.revokeRefreshTokens(uid);
}
