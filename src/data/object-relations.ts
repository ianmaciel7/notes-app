import "server-only";
import { getFirestore } from "firebase-admin/firestore";

export interface CollectionObjectRelationRecord {
  id: string;
  sourceObjectId: string;
  targetObjectId: string;
  position: number;
}

export async function getCollectionObjectRelations(
  spaceId: string,
): Promise<CollectionObjectRelationRecord[]> {
  const db = getFirestore();
  const relationsSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("relations")
    .where("type", "==", "collection-object")
    .get();

  return relationsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      sourceObjectId: String(data.sourceObjectId ?? ""),
      targetObjectId: String(data.targetObjectId ?? ""),
      position: Number(data.position ?? 0),
    };
  });
}
