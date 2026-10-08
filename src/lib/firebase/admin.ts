import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseServerProjectId } from "@/lib/firebase/server-config";

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = getFirebaseServerProjectId();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  if (privateKey && clientEmail) {
    return initializeApp({
      credential: cert({ clientEmail, privateKey, projectId }),
      projectId,
    });
  }

  return initializeApp({ projectId });
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}
