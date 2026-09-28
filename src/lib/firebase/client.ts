import { getApp, getApps, initializeApp } from "firebase/app";
import { type Auth, connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "notes-app-dev.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "notes-app-dev",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "notes-app-dev.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef",
};

export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);

const EMULATOR_HOST =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";

const shouldUseEmulator =
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" ||
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test";

let emulatorConnected = false;

export function connectToAuthEmulator(host = EMULATOR_HOST): void {
  if (emulatorConnected) return;

  // Firebase auth emulator URL
  const emulatorUrl = host.startsWith("http") ? host : `http://${host}`;
  try {
    connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
    emulatorConnected = true;
  } catch (_err) {
    // Ignore already connected or invalid state in tests
  }
}

if (shouldUseEmulator) {
  connectToAuthEmulator();
}
