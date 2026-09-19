import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  type AvailableObject,
  CollectionEditor,
  type CollectionItem,
} from "@/components/authoring/collection-editor";
import { requireActionUser } from "@/data/action-auth";
import { getCollectionObjectRelations } from "@/data/object-relations";
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

  return (
    <Suspense fallback={<div className="p-4">Loading collections...</div>}>
      <CollectionsPageContent spaceId={spaceId} />
    </Suspense>
  );
}

async function CollectionsPageContent({ spaceId }: { spaceId: string }) {
  const user = await requireActionUser();
  await getOwnedSpace(user.uid, spaceId);

  const [collectionObjects, allObjects, relations] = await Promise.all([
    listObjects(user.uid, spaceId, "collection"),
    listObjects(user.uid, spaceId),
    getCollectionObjectRelations(spaceId),
  ]);

  const membersByCollection = new Map<
    string,
    { targetId: string; position: number }[]
  >();

  for (const relation of relations) {
    const sourceId = relation.sourceObjectId;
    const targetId = relation.targetObjectId;
    const position = relation.position;

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
