import { getFirestore } from "firebase-admin/firestore";
import { notFound } from "next/navigation";

import {
  type AvailableObject,
  CollectionEditor,
  type CollectionItem,
} from "@/components/authoring/collection-editor";
import { requireActionUser } from "@/data/action-auth";
import { listObjects } from "@/data/objects";
import { getOwnedSpace } from "@/data/spaces";
import { hasLocale } from "@/lib/i18n/dictionaries";

export default async function CollectionsManagementPage({
  params,
}: {
  params: Promise<{ lang: string; spaceId: string }>;
}) {
  const { lang, spaceId } = await params;
  if (!hasLocale(lang)) notFound();

  const user = await requireActionUser();
  await getOwnedSpace(user.uid, spaceId);

  const [collectionObjects, allObjects] = await Promise.all([
    listObjects(user.uid, spaceId, "collection"),
    listObjects(user.uid, spaceId),
  ]);

  const db = getFirestore();
  const relationsSnap = await db
    .collection("spaces")
    .doc(spaceId)
    .collection("relations")
    .where("type", "==", "collection-object")
    .get();

  const membersByCollection = new Map<
    string,
    { targetId: string; position: number }[]
  >();

  for (const doc of relationsSnap.docs) {
    const data = doc.data();
    const sourceId = String(data.sourceObjectId ?? "");
    const targetId = String(data.targetObjectId ?? "");
    const position = Number(data.position ?? 0);

    const list = membersByCollection.get(sourceId) ?? [];
    list.push({ targetId, position });
    membersByCollection.set(sourceId, list);
  }

  const collectionsData: CollectionItem[] = collectionObjects.map((c) => {
    const members = (membersByCollection.get(c.id) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((m) => m.targetId);
    return {
      id: c.id,
      title: c.title,
      lifecycle: c.lifecycle,
      memberIds: members,
      updatedAt: c.updatedAt,
    };
  });

  const nonCollectionObjects: AvailableObject[] = allObjects
    .filter((o) => o.type !== "collection")
    .map((o) => ({
      id: o.id,
      title: o.title,
      type: o.type,
      lifecycle: o.lifecycle,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Collections
        </h2>
        <p className="text-sm text-muted-foreground">
          Organize your questions and exams into structured study collections.
        </p>
      </div>

      <CollectionEditor
        spaceId={spaceId}
        initialCollections={collectionsData}
        availableObjects={nonCollectionObjects}
      />
    </div>
  );
}
