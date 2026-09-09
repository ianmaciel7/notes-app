import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import {
  createFirebaseAdminAuthAdapter,
  createFirebaseAuthVerifier,
} from "@/lib/auth/firebase-auth";

export function getServerFirebaseAdminApp() {
  return (
    getApps()[0] ??
    initializeApp({
      credential: applicationDefault(),
    })
  );
}

export function createServerFirebaseAuthVerifier() {
  const app = getServerFirebaseAdminApp();
  return createFirebaseAuthVerifier(createFirebaseAdminAuthAdapter(getAuth(app)));
}
