import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-revisa.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-revisa",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-revisa.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const app = getFirebaseApp();
export const auth: Auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Connect to Auth Emulator if enabled
let emulatorConnected = false;

export function setupEmulator() {
  if (emulatorConnected) return;

  const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";
  const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || "http://127.0.0.1:9099";

  if (useEmulator && typeof window !== "undefined") {
    try {
      connectAuthEmulator(auth, emulatorHost, { disableWarnings: true });
      emulatorConnected = true;
    } catch {
      // Emulator might already be attached in HMR
    }
  }
}

if (typeof window !== "undefined") {
  setupEmulator();
}
