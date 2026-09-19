import { getFirestore } from "firebase-admin/firestore";

export async function clearFirestoreCollections(
  ...collectionIds: string[]
): Promise<void> {
  const db = getFirestore();
  await Promise.all(
    collectionIds.map(async (id) => {
      const snap = await db.collection(id).get();
      const deletes = snap.docs.map((d) => d.ref.delete());
      await Promise.all(deletes);
    }),
  );
}
