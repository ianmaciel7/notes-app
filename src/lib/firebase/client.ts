import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import { FIREBASE_PROJECT_ID } from "@/lib/firebase/config";

const AUTH_EMULATOR_PORT = 9099;

// The redirect flow relays its result through an iframe served by the
// Emulator. Browsers partition that storage when the Emulator host and the
// page host are cross-site (localhost vs 127.0.0.1), so match the page host.
function getAuthEmulatorUrl() {
  const pageHost =
    typeof window === "undefined" ? undefined : window.location.hostname;
  const host = pageHost === "localhost" ? "localhost" : "127.0.0.1";

  return `http://${host}:${AUTH_EMULATOR_PORT}`;
}

let emulatorConnected = false;

function getClientConfig() {
  const configuredValue = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

  if (configuredValue) {
    const configured = JSON.parse(configuredValue) as {
      apiKey?: string;
      appId?: string;
      authDomain?: string;
      projectId?: string;
    };

    if (
      !configured.apiKey ||
      !configured.appId ||
      !configured.authDomain ||
      !configured.projectId
    ) {
      throw new Error("Firebase public configuration is incomplete.");
    }

    if (
      process.env.NODE_ENV !== "production" &&
      configured.projectId !== FIREBASE_PROJECT_ID
    ) {
      throw new Error("Firebase local configuration must use demo-notes-app.");
    }

    return configured as Required<typeof configured>;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Firebase public configuration is required in production.");
  }

  return {
    apiKey: "fake-api-key",
    appId: FIREBASE_PROJECT_ID,
    authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: FIREBASE_PROJECT_ID,
  };
}

export function getFirebaseClient(): { app: FirebaseApp; auth: Auth } {
  const app =
    getApps().length > 0 ? getApp() : initializeApp(getClientConfig());
  const auth = getAuth(app);

  if (process.env.NODE_ENV !== "production" && !emulatorConnected) {
    auth.settings.appVerificationDisabledForTesting = true;
    connectAuthEmulator(auth, getAuthEmulatorUrl());
    emulatorConnected = true;
  }

  return { app, auth };
}
