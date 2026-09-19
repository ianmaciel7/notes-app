import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

async function verifyMigration() {
  const spaceId = process.env.MIGRATION_SPACE_ID;
  if (!spaceId) {
    console.error("MIGRATION_SPACE_ID is required.");
    process.exit(1);
  }

  if (getApps().length === 0) {
    initializeApp();
  }
  const db = getFirestore();

  const objectsSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .get();

  const relationsSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("relations")
    .get();

  console.log(`=== Verification Report for Space "${spaceId}" ===`);
  console.log(`Migrated objects: ${objectsSnap.docs.length}`);
  console.log(`Migrated relations: ${relationsSnap.docs.length}`);

  if (objectsSnap.docs.length === 0) {
    console.error("Verification failed: no objects found in space.");
    process.exit(1);
  }

  console.log("Verification PASSED.");
}

if (process.argv[1]?.endsWith("verify-exam-fsrs-migration.ts")) {
  verifyMigration().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
