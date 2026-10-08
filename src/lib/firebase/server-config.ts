import "server-only";

import { FIREBASE_PROJECT_ID } from "@/lib/firebase/config";

const AUTH_EMULATOR_HOST = "127.0.0.1:9099";

export function getFirebaseServerProjectId() {
  const projectId = process.env.FIREBASE_PROJECT_ID ?? FIREBASE_PROJECT_ID;

  if (process.env.NODE_ENV !== "production") {
    if (process.env.FIREBASE_AUTH_EMULATOR_HOST !== AUTH_EMULATOR_HOST) {
      throw new Error(
        "FIREBASE_AUTH_EMULATOR_HOST must be set to 127.0.0.1:9099 locally.",
      );
    }

    if (projectId !== FIREBASE_PROJECT_ID) {
      throw new Error(
        "Firebase local server configuration must use demo-notes-app.",
      );
    }
  }

  return projectId;
}
