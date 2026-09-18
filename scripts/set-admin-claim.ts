import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID ?? "demo-notes-app";

if (
  process.env.FIREBASE_AUTH_EMULATOR_HOST === undefined &&
  !process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
}

const app = getApps()[0] ?? initializeApp({ projectId });
const auth = getAuth(app);

async function setAdminClaim(): Promise<void> {
  const target = process.argv[2]?.trim();

  if (!target) {
    console.error("Usage: pnpm set:admin <uid-or-email>");
    console.error("Example: pnpm set:admin admin@example.com");
    console.error("Example: pnpm set:admin wI9hWd3JkP2xL");
    process.exit(1);
  }

  console.log(`[set-admin-claim] Target Project: ${projectId}`);
  console.log(
    `[set-admin-claim] Auth Host: ${process.env.FIREBASE_AUTH_EMULATOR_HOST ?? "Google Cloud Production"}`,
  );

  let userRecord;
  if (target.includes("@")) {
    userRecord = await auth.getUserByEmail(target);
  } else {
    userRecord = await auth.getUser(target);
  }

  const existingClaims = userRecord.customClaims ?? {};
  const updatedClaims = {
    ...existingClaims,
    role: "admin",
    admin: true,
  };

  await auth.setCustomUserClaims(userRecord.uid, updatedClaims);

  console.log(`[set-admin-claim] Successfully updated custom claims:`);
  console.log(`  UID: ${userRecord.uid}`);
  console.log(`  Email: ${userRecord.email ?? "N/A"}`);
  console.log(`  Custom Claims: ${JSON.stringify(updatedClaims, null, 2)}`);
}

setAdminClaim().catch((error) => {
  console.error("[set-admin-claim] Failed to set admin claim:", error);
  process.exit(1);
});
