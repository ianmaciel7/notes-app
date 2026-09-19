import "server-only";

import { getFirestore } from "firebase-admin/firestore";
import { getOwnedSpace } from "@/data/spaces";
import {
  assertLifecycleTransition,
  type ObjectRecord,
  type ObjectRevision,
  type SpaceObjectType,
} from "@/domain/objects/object";
import { DomainError } from "@/domain/shared/domain-error";

export async function createObjectDraft(
  ownerId: string,
  spaceId: string,
  type: SpaceObjectType,
  title: string,
): Promise<ObjectRecord> {
  await getOwnedSpace(ownerId, spaceId);

  if (!title || title.trim().length === 0) {
    throw new DomainError("validation-failed", {
      message: "Title must not be empty.",
    });
  }

  const db = getFirestore();
  const ref = db.collection("spaces").doc(spaceId).collection("objects").doc();
  const now = new Date().toISOString();

  const record: ObjectRecord = {
    id: ref.id,
    spaceId,
    ownerId,
    type,
    title: title.trim(),
    lifecycle: "draft",
    latestRevisionId: "",
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
  };

  await ref.set(record);
  return record;
}

export async function saveDraftRevision<TPayload>(
  ownerId: string,
  spaceId: string,
  objectId: string,
  payload: TPayload,
): Promise<ObjectRevision<TPayload>> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const objRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(objectId);

  return await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(objRef);
    if (!snap.exists || snap.data()?.ownerId !== ownerId) {
      throw new DomainError("forbidden");
    }
    const objData = snap.data() as ObjectRecord;

    const revsRef = objRef.collection("revisions");
    const latestRevs = await transaction.get(
      revsRef.orderBy("version", "desc").limit(1),
    );
    const lastVersion = latestRevs.empty
      ? 0
      : (latestRevs.docs[0].data().version as number);
    const newVersion = lastVersion + 1;

    const revId = `${objectId}_rev_${crypto.randomUUID()}`;
    const revRef = revsRef.doc(revId);
    const now = new Date().toISOString();

    const revision: ObjectRevision<TPayload> = {
      id: revId,
      objectId,
      objectType: objData.type,
      version: newVersion,
      publicationState: "draft",
      payload,
      schemaVersion: 1,
      createdBy: ownerId,
      createdAt: now,
    };

    transaction.set(revRef, revision);
    transaction.update(objRef, {
      latestRevisionId: revId,
      updatedAt: now,
    });

    return revision;
  });
}

export async function publishRevision(
  ownerId: string,
  spaceId: string,
  objectId: string,
): Promise<ObjectRevision<unknown>> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const objRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(objectId);

  return await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(objRef);
    if (!snap.exists || snap.data()?.ownerId !== ownerId) {
      throw new DomainError("forbidden");
    }
    const objData = snap.data() as ObjectRecord;
    if (!objData.latestRevisionId) {
      throw new DomainError("validation-failed", {
        message: "Cannot publish an object with no revisions.",
      });
    }

    const latestDraftRef = objRef
      .collection("revisions")
      .doc(objData.latestRevisionId);
    const draftSnap = await transaction.get(latestDraftRef);
    if (!draftSnap.exists) {
      throw new DomainError("not-found", {
        message: "Latest draft revision not found.",
      });
    }
    const draftData = draftSnap.data() as ObjectRevision<unknown>;

    const revsRef = objRef.collection("revisions");
    const latestRevs = await transaction.get(
      revsRef.orderBy("version", "desc").limit(1),
    );
    const lastVersion = latestRevs.empty
      ? 0
      : (latestRevs.docs[0].data().version as number);
    const newVersion = lastVersion + 1;

    const pubRevId = `${objectId}_rev_${crypto.randomUUID()}`;
    const pubRevRef = revsRef.doc(pubRevId);
    const now = new Date().toISOString();

    const publishedRevision: ObjectRevision<unknown> = {
      id: pubRevId,
      objectId,
      objectType: objData.type,
      version: newVersion,
      publicationState: "published",
      payload: draftData.payload,
      schemaVersion: 1,
      createdBy: ownerId,
      createdAt: now,
    };

    if (objData.lifecycle === "draft") {
      assertLifecycleTransition("draft", "published");
    }

    transaction.set(pubRevRef, publishedRevision);
    transaction.update(objRef, {
      lifecycle: "published",
      publishedRevisionId: pubRevId,
      latestRevisionId: pubRevId,
      updatedAt: now,
    });

    return publishedRevision;
  });
}

export async function archiveObject(
  ownerId: string,
  spaceId: string,
  objectId: string,
): Promise<ObjectRecord> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  const objRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(objectId);

  return await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(objRef);
    if (!snap.exists || snap.data()?.ownerId !== ownerId) {
      throw new DomainError("forbidden");
    }
    const objData = snap.data() as ObjectRecord;
    assertLifecycleTransition(objData.lifecycle, "archived");

    const now = new Date().toISOString();
    const updated: Partial<ObjectRecord> = {
      lifecycle: "archived",
      updatedAt: now,
    };

    transaction.update(objRef, updated);

    return {
      ...objData,
      ...updated,
    };
  });
}

export async function getObjectRevision<TPayload>(
  ownerId: string,
  spaceId: string,
  revisionId: string,
): Promise<ObjectRevision<TPayload>> {
  await getOwnedSpace(ownerId, spaceId);
  const objectId = revisionId.split("_")[0];
  if (!objectId) {
    throw new DomainError("forbidden");
  }

  const db = getFirestore();
  const objRef = db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .doc(objectId);
  const objSnap = await objRef.get();
  if (!objSnap.exists || objSnap.data()?.ownerId !== ownerId) {
    throw new DomainError("forbidden");
  }

  const revRef = objRef.collection("revisions").doc(revisionId);
  const revSnap = await revRef.get();
  if (!revSnap.exists) {
    throw new DomainError("forbidden");
  }

  return revSnap.data() as ObjectRevision<TPayload>;
}

export async function listObjects(
  ownerId: string,
  spaceId: string,
  type?: SpaceObjectType,
): Promise<ObjectRecord[]> {
  await getOwnedSpace(ownerId, spaceId);
  const db = getFirestore();
  let query: FirebaseFirestore.Query = db
    .collection("spaces")
    .doc(spaceId)
    .collection("objects")
    .where("ownerId", "==", ownerId);

  if (type) {
    query = query.where("type", "==", type);
  }

  const snap = await query.get();
  return snap.docs.map((doc) => doc.data() as ObjectRecord);
}
