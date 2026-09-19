import { getApps, initializeApp } from "firebase-admin/app";
import { afterEach, beforeAll } from "vitest";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "demo-notes-app";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8080";

process.env.FIRESTORE_EMULATOR_HOST = emulatorHost;
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";

beforeAll(() => {
  if (getApps().length === 0) {
    initializeApp({ projectId });
  }
});

async function clearFirestore(): Promise<void> {
  const response = await fetch(
    `http://${emulatorHost}/emulator/v1/projects/${projectId}/databases/(default)/documents`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    throw new Error(`Failed to clear Firestore emulator: ${response.status}`);
  }
}

afterEach(async () => {
  await clearFirestore();
});
