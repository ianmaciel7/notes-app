import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ACTIVE_SPACE_SETTING_ID,
  ENGINEERING_SPACE_ID,
  LOCAL_ACCOUNT_ID,
  PERSONAL_SPACE_ID,
} from "@/lib/domain/default-spaces";
import type { SpaceEntityRecord } from "@/lib/domain/records";
import {
  BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION,
  BLOCK_ID_PREFIX,
} from "@/lib/editor/document-schema";
import { KnowledgeDatabase } from "../schema";
import { createRepositories, type Repositories } from "./repository-factory";

async function seedCascadeTables(db: KnowledgeDatabase, spaceId: string) {
  const now = new Date().toISOString();
  await db.objectTypes.put({
    spaceId,
    id: "type-note",
    ownership: "default",
    singularName: "Note",
    pluralName: "Notes",
    iconName: "file-text",
    tone: "gray",
    lifecycleKind: "general",
    propertyDefinitions: [],
    collectionIds: [],
    presentation: { defaultView: "list", availableViews: ["list"] },
  });
  await db.entities.put({
    spaceId,
    id: "ent-1",
    objectTypeId: "type-note",
    type: "note",
    title: "Test Note",
    createdAt: now,
    updatedAt: now,
    tags: [],
    relations: [],
    properties: {},
  });
  await db.collections.put({
    spaceId,
    id: "col-1",
    structureId: "type-note",
    name: "Engineering Notes",
  });
  await db.tags.put({ spaceId, id: "tag-1", name: "architecture" });
  await db.relations.put({
    spaceId,
    id: "rel-1",
    sourceId: "ent-1",
    targetId: "ent-2",
    propertyId: "relatedTo",
    createdAt: now,
  });
  await db.media.put({
    spaceId,
    id: "media-1",
    name: "diagram.png",
    mimeType: "image/png",
    createdAt: now,
    updatedAt: now,
  });
  await db.spaceSettings.put({
    spaceId,
    id: "setting-1",
    key: "theme",
    value: "dark",
    updatedAt: now,
  });
  await db.trash.put({
    spaceId,
    id: "trash-1",
    entityId: "ent-old",
    label: "Old note",
    typeLabel: "note",
    trashedAt: now,
    purgeAfter: now,
  });
  await db.syncMutations.put({
    id: "mut-1",
    spaceId,
    entityId: "ent-1",
    entityType: "note",
    operation: "set",
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });
}

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: SpaceRepository test suite
describe("SpaceRepository", () => {
  let db: KnowledgeDatabase;
  let repos: Repositories;

  beforeEach(() => {
    db = new KnowledgeDatabase(`test-db-${crypto.randomUUID()}`);
    repos = createRepositories(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("ensureDefaultSpaces seeds Personal and Engineering spaces and sets active space", async () => {
    expect(await db.spaces.count()).toBe(0);

    await repos.spaces.ensureDefaultSpaces();

    const spaces = await repos.spaces.listSpaces();
    expect(spaces).toHaveLength(2);

    const personal = spaces.find((s) => s.id === PERSONAL_SPACE_ID);
    const engineering = spaces.find((s) => s.id === ENGINEERING_SPACE_ID);

    expect(personal?.name).toBe("Personal Space");
    expect(personal?.sortOrder).toBe(0);
    expect(engineering?.name).toBe("Engineering & Arch");
    expect(engineering?.sortOrder).toBe(1);

    const activeSetting = await db.appSettings.get(ACTIVE_SPACE_SETTING_ID);
    expect(activeSetting?.value).toBe(PERSONAL_SPACE_ID);

    await repos.spaces.ensureDefaultSpaces();
    expect(await db.spaces.count()).toBe(2);
  });

  it("listSpaces returns spaces sorted by sortOrder", async () => {
    await repos.spaces.ensureDefaultSpaces();

    const customSpace = await repos.spaces.createSpace({
      name: "Alpha Workspace",
      description: "Testing order",
    });

    const spaces = await repos.spaces.listSpaces();
    expect(spaces).toHaveLength(3);
    expect(spaces.map((s) => s.id)).toEqual([
      PERSONAL_SPACE_ID,
      ENGINEERING_SPACE_ID,
      customSpace.id,
    ]);
    expect(spaces[0].sortOrder).toBeLessThan(spaces[1].sortOrder);
    expect(spaces[1].sortOrder).toBeLessThan(spaces[2].sortOrder);
  });

  it("createSpace validates name and generates unique ID", async () => {
    await repos.spaces.ensureDefaultSpaces();

    await expect(repos.spaces.createSpace({ name: "" })).rejects.toThrow(
      "Space name is required and cannot be empty",
    );
    await expect(repos.spaces.createSpace({ name: "   " })).rejects.toThrow(
      "Space name is required and cannot be empty",
    );

    const space1 = await repos.spaces.createSpace({
      name: "Project A",
      description: "Docs for Project A",
      icon: "zap",
      color: "amber",
    });
    const space2 = await repos.spaces.createSpace({ name: "Project B" });

    expect(space1.id).toMatch(/^space-[0-9a-f-]+$/);
    expect(space2.id).toMatch(/^space-[0-9a-f-]+$/);
    expect(space1.id).not.toBe(space2.id);
    expect(space1.name).toBe("Project A");
    expect(space1.icon).toBe("zap");
    expect(space1.color).toBe("amber");
    expect(space1.accountId).toBe(LOCAL_ACCOUNT_ID);
  });

  it("renameSpace and reorderSpaces update correctly", async () => {
    await repos.spaces.ensureDefaultSpaces();

    await expect(repos.spaces.renameSpace(PERSONAL_SPACE_ID, "  ")).rejects.toThrow(
      "Space name cannot be empty.",
    );
    await expect(repos.spaces.renameSpace("non-existent-space", "New Name")).rejects.toThrow(
      'Space with ID "non-existent-space" not found.',
    );

    await repos.spaces.renameSpace(PERSONAL_SPACE_ID, "Ian's Personal Brain");
    const personal = await repos.spaces.getSpace(PERSONAL_SPACE_ID);
    expect(personal?.name).toBe("Ian's Personal Brain");

    await repos.spaces.reorderSpaces([ENGINEERING_SPACE_ID, PERSONAL_SPACE_ID]);
    const reordered = await repos.spaces.listSpaces();
    expect(reordered[0].id).toBe(ENGINEERING_SPACE_ID);
    expect(reordered[0].sortOrder).toBe(0);
    expect(reordered[1].id).toBe(PERSONAL_SPACE_ID);
    expect(reordered[1].sortOrder).toBe(1);
  });

  it("deleteSpace cascades deletion across all tables and returns fallback space", async () => {
    await repos.spaces.ensureDefaultSpaces();
    const targetSpaceId = ENGINEERING_SPACE_ID;

    await seedCascadeTables(db, targetSpaceId);

    await db.entities.put({
      spaceId: PERSONAL_SPACE_ID,
      id: "personal-ent",
      objectTypeId: "type-note",
      type: "note",
      title: "Personal Entity",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      relations: [],
      properties: {},
    });

    await repos.spaces.setActiveSpace(targetSpaceId);

    const result = await repos.spaces.deleteSpace(targetSpaceId);
    expect(result.fallbackSpaceId).toBe(PERSONAL_SPACE_ID);

    expect(await db.spaces.get(targetSpaceId)).toBeUndefined();
    expect(await db.objectTypes.where("spaceId").equals(targetSpaceId).count()).toBe(0);
    expect(await db.entities.where("spaceId").equals(targetSpaceId).count()).toBe(0);
    expect(await db.collections.where("spaceId").equals(targetSpaceId).count()).toBe(0);
    expect(await db.tags.where("spaceId").equals(targetSpaceId).count()).toBe(0);
    expect(await db.relations.where("spaceId").equals(targetSpaceId).count()).toBe(0);
    expect(await db.media.where("spaceId").equals(targetSpaceId).count()).toBe(0);
    expect(await db.spaceSettings.where("spaceId").equals(targetSpaceId).count()).toBe(0);
    expect(await db.trash.where("spaceId").equals(targetSpaceId).count()).toBe(0);
    expect(await db.syncMutations.where("spaceId").equals(targetSpaceId).count()).toBe(0);

    expect(await db.entities.get([PERSONAL_SPACE_ID, "personal-ent"])).toBeDefined();

    const activeSetting = await db.appSettings.get(ACTIVE_SPACE_SETTING_ID);
    expect(activeSetting?.value).toBe(PERSONAL_SPACE_ID);

    await expect(repos.spaces.deleteSpace(PERSONAL_SPACE_ID)).rejects.toThrow(
      "Cannot delete the only remaining space.",
    );
  });
});

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: EntityRepository test suite
describe("EntityRepository", () => {
  let db: KnowledgeDatabase;
  let repos: Repositories;

  beforeEach(() => {
    db = new KnowledgeDatabase(`test-db-${crypto.randomUUID()}`);
    repos = createRepositories(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("createEntity initializes Capacities Block Document Schema v3 and enqueues sync mutation", async () => {
    const spaceId = PERSONAL_SPACE_ID;
    const entity = await repos.entities.createEntity(spaceId, {
      objectTypeId: "obj-type-page",
      title: "My Concept Doc",
      tags: ["ideas", "draft"],
    });

    expect(entity.id).toMatch(/^ent-[0-9a-f-]+$/);
    expect(entity.spaceId).toBe(spaceId);
    expect(entity.title).toBe("My Concept Doc");
    expect(entity.tags).toEqual(["ideas", "draft"]);
    expect(entity._syncStatus).toBe("pending");

    expect(entity.document).toBeDefined();
    expect(entity.document?.schemaVersion).toBe(BLOCK_EDITOR_DOCUMENT_SCHEMA_VERSION);
    expect(entity.document?.schemaVersion).toBe(3);
    expect(entity.document?.doc.type).toBe("doc");
    expect(Array.isArray(entity.document?.doc.content)).toBe(true);

    const firstNode = entity.document?.doc.content[0];
    expect(firstNode?.type).toBe("paragraph");
    expect(firstNode?.attrs?.id).toBeDefined();
    expect(firstNode?.attrs?.id?.startsWith(BLOCK_ID_PREFIX)).toBe(true);
    expect(firstNode?.attrs?.id?.startsWith("block:")).toBe(true);

    const mutations = await db.syncMutations.where("entityId").equals(entity.id).toArray();
    expect(mutations).toHaveLength(1);
    expect(mutations[0].operation).toBe("set");
    expect(mutations[0].status).toBe("pending");
    expect(mutations[0].entityType).toBe("obj-type-page");
    expect((mutations[0].payload as SpaceEntityRecord).id).toBe(entity.id);
  });

  it("listEntities filters by objectTypeId, type, and tag", async () => {
    const spaceId = PERSONAL_SPACE_ID;

    await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      type: "note",
      title: "Note 1",
      tags: ["work", "important"],
    });
    await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      type: "note",
      title: "Note 2",
      tags: ["personal"],
    });
    await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-task",
      type: "task",
      title: "Task 1",
      tags: ["work"],
    });

    const notes = await repos.entities.listEntities(spaceId, { objectTypeId: "type-note" });
    expect(notes).toHaveLength(2);
    expect(notes.every((e) => e.objectTypeId === "type-note")).toBe(true);

    const tasks = await repos.entities.listEntities(spaceId, { objectTypeId: "type-task" });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Task 1");

    const tasksByType = await repos.entities.listEntities(spaceId, { type: "task" });
    expect(tasksByType).toHaveLength(1);

    const workEntities = await repos.entities.listEntities(spaceId, { tag: "work" });
    expect(workEntities).toHaveLength(2);

    const importantEntities = await repos.entities.listEntities(spaceId, { tag: "important" });
    expect(importantEntities).toHaveLength(1);
    expect(importantEntities[0].title).toBe("Note 1");
  });

  it("updateEntity patches entity, updates updatedAt, and enqueues sync mutation", async () => {
    const spaceId = PERSONAL_SPACE_ID;
    const initial = await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      title: "Original Title",
      tags: ["v1"],
    });

    const updated = await repos.entities.updateEntity(spaceId, initial.id, {
      title: "Patched Title",
      tags: ["v1", "v2"],
      properties: { status: "reviewed" },
    });

    expect(updated.title).toBe("Patched Title");
    expect(updated.tags).toEqual(["v1", "v2"]);
    expect(updated.properties).toEqual({ status: "reviewed" });
    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(initial.updatedAt).getTime(),
    );

    const pendingMutations = await repos.syncMutations.listPendingMutations();
    const entityMutations = pendingMutations.filter((m) => m.entityId === initial.id);
    expect(entityMutations).toHaveLength(1);
    expect(entityMutations[0].operation).toBe("set");
    expect((entityMutations[0].payload as SpaceEntityRecord).title).toBe("Patched Title");

    await expect(
      repos.entities.updateEntity(spaceId, "unknown-id", { title: "Fail" }),
    ).rejects.toThrow('Entity "unknown-id" not found in space "personal-space".');
  });
});

describe("RelationRepository", () => {
  let db: KnowledgeDatabase;
  let repos: Repositories;

  beforeEach(() => {
    db = new KnowledgeDatabase(`test-db-${crypto.randomUUID()}`);
    repos = createRepositories(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("createRelation verifies multi-tenant boundary and fails if entities are not in same space", async () => {
    const spaceA = PERSONAL_SPACE_ID;
    const spaceB = ENGINEERING_SPACE_ID;

    const entityA = await repos.entities.createEntity(spaceA, {
      objectTypeId: "type-note",
      title: "Entity in Space A",
    });
    const entityB = await repos.entities.createEntity(spaceB, {
      objectTypeId: "type-note",
      title: "Entity in Space B",
    });

    await expect(
      repos.relations.createRelation(spaceA, entityA.id, entityB.id, "references"),
    ).rejects.toThrow(
      `Cannot link relation: target entity "${entityB.id}" does not exist in space "${spaceA}".`,
    );

    await expect(
      repos.relations.createRelation(spaceB, entityA.id, entityB.id, "references"),
    ).rejects.toThrow(
      `Cannot link relation: source entity "${entityA.id}" does not exist in space "${spaceB}".`,
    );

    await expect(
      repos.relations.createRelation(spaceA, "missing-src", entityA.id, "references"),
    ).rejects.toThrow(
      `Cannot link relation: source entity "missing-src" does not exist in space "${spaceA}".`,
    );
  });

  it("listOutgoingRelations and listIncomingBacklinks return expected records", async () => {
    const spaceId = PERSONAL_SPACE_ID;

    const source = await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      title: "Architecture Doc",
    });
    const target1 = await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      title: "Database Design",
    });
    const target2 = await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      title: "API Spec",
    });

    const rel1 = await repos.relations.createRelation(spaceId, source.id, target1.id, "specifies");
    const rel2 = await repos.relations.createRelation(spaceId, source.id, target2.id, "specifies");

    const outgoing = await repos.relations.listOutgoingRelations(spaceId, source.id);
    expect(outgoing).toHaveLength(2);
    expect(outgoing.map((r) => r.id).sort()).toEqual([rel1.id, rel2.id].sort());

    const backlinks1 = await repos.relations.listIncomingBacklinks(spaceId, target1.id);
    expect(backlinks1).toHaveLength(1);
    expect(backlinks1[0].sourceId).toBe(source.id);
    expect(backlinks1[0].propertyId).toBe("specifies");

    const updatedSource = await repos.entities.getEntity(spaceId, source.id);
    expect(updatedSource?.relations).toHaveLength(2);
    expect(updatedSource?.relations.map((r) => r.targetEntityId)).toContain(target1.id);
    expect(updatedSource?.relations.map((r) => r.targetEntityId)).toContain(target2.id);
  });
});

describe("TrashRepository (Graph-Safe Soft-Deletion)", () => {
  let db: KnowledgeDatabase;
  let repos: Repositories;

  beforeEach(() => {
    db = new KnowledgeDatabase(`test-db-${crypto.randomUUID()}`);
    repos = createRepositories(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("moveToTrash moves entity to trash table, deletes incident relations, and captures snapshots", async () => {
    const spaceId = PERSONAL_SPACE_ID;

    const center = await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      title: "Center Node",
    });
    const upstream = await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      title: "Upstream Node",
    });
    const downstream = await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      title: "Downstream Node",
    });

    const incomingRel = await repos.relations.createRelation(
      spaceId,
      upstream.id,
      center.id,
      "linksTo",
    );
    const outgoingRel = await repos.relations.createRelation(
      spaceId,
      center.id,
      downstream.id,
      "linksTo",
    );

    const trashRecord = await repos.trash.moveToTrash(spaceId, center.id);

    expect(trashRecord.entityId).toBe(center.id);
    expect(trashRecord.label).toBe("Center Node");
    expect(trashRecord.entitySnapshot?.id).toBe(center.id);
    expect(trashRecord.relationSnapshots).toHaveLength(2);

    const snapIds = trashRecord.relationSnapshots?.map((r) => r.id).sort();
    expect(snapIds).toEqual([incomingRel.id, outgoingRel.id].sort());

    const activeEntity = await repos.entities.getEntity(spaceId, center.id);
    expect(activeEntity).toBeUndefined();

    const outgoing = await repos.relations.listOutgoingRelations(spaceId, center.id);
    const incoming = await repos.relations.listIncomingBacklinks(spaceId, center.id);
    expect(outgoing).toHaveLength(0);
    expect(incoming).toHaveLength(0);

    const trashed = await repos.trash.listTrash(spaceId);
    expect(trashed.some((t) => t.id === trashRecord.id)).toBe(true);
  });

  it("restoreFromTrash restores both entity and incident relations atomically, removing trash record", async () => {
    const spaceId = PERSONAL_SPACE_ID;

    const nodeA = await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      title: "Node A",
    });
    const nodeB = await repos.entities.createEntity(spaceId, {
      objectTypeId: "type-note",
      title: "Node B",
    });

    const rel = await repos.relations.createRelation(spaceId, nodeA.id, nodeB.id, "dependsOn");

    const trashRecord = await repos.trash.moveToTrash(spaceId, nodeA.id);

    const restored = await repos.trash.restoreFromTrash(spaceId, trashRecord.id);

    expect(restored.id).toBe(nodeA.id);
    expect(restored.title).toBe("Node A");

    const activeEntity = await repos.entities.getEntity(spaceId, nodeA.id);
    expect(activeEntity).toBeDefined();
    expect(activeEntity?.title).toBe("Node A");

    const outgoing = await repos.relations.listOutgoingRelations(spaceId, nodeA.id);
    expect(outgoing).toHaveLength(1);
    expect(outgoing[0].id).toBe(rel.id);
    expect(outgoing[0].targetId).toBe(nodeB.id);

    const trashed = await repos.trash.listTrash(spaceId);
    expect(trashed.some((t) => t.id === trashRecord.id)).toBe(false);
  });
});

describe("SyncMutationRepository", () => {
  let db: KnowledgeDatabase;
  let repos: Repositories;

  beforeEach(() => {
    db = new KnowledgeDatabase(`test-db-${crypto.randomUUID()}`);
    repos = createRepositories(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("enqueueMutation performs LWW coalescing for pending writes on same entity", async () => {
    const spaceId = PERSONAL_SPACE_ID;
    const entityId = "ent-test-lww";
    const entityType = "note";

    const mut1 = await repos.syncMutations.enqueueMutation({
      spaceId,
      entityId,
      entityType,
      operation: "set",
      payload: { title: "Version 1" },
    });

    expect(mut1.status).toBe("pending");
    expect(mut1.id).toMatch(/^mut-[0-9a-f-]+$/);

    const pendingAfter1 = await repos.syncMutations.listPendingMutations();
    expect(pendingAfter1.filter((m) => m.entityId === entityId)).toHaveLength(1);

    const mut2 = await repos.syncMutations.enqueueMutation({
      spaceId,
      entityId,
      entityType,
      operation: "set",
      payload: { title: "Version 2 (latest)" },
    });

    expect(mut2.id).toBe(mut1.id);
    expect((mut2.payload as { title: string }).title).toBe("Version 2 (latest)");

    const allForEntity = await db.syncMutations.where("entityId").equals(entityId).toArray();
    expect(allForEntity).toHaveLength(1);
    expect((allForEntity[0].payload as { title: string }).title).toBe("Version 2 (latest)");

    await repos.syncMutations.markMutationStatus(mut2.id, "syncing");
    const mut3 = await repos.syncMutations.enqueueMutation({
      spaceId,
      entityId,
      entityType,
      operation: "set",
      payload: { title: "Version 3" },
    });

    expect(mut3.id).toBe(mut1.id);
    expect(mut3.status).toBe("pending");
    expect((mut3.payload as { title: string }).title).toBe("Version 3");

    await repos.syncMutations.markMutationStatus(mut3.id, "synced");

    const mut4 = await repos.syncMutations.enqueueMutation({
      spaceId,
      entityId,
      entityType,
      operation: "delete",
    });

    expect(mut4.id).not.toBe(mut1.id);
    expect(mut4.operation).toBe("delete");

    const totalForEntity = await db.syncMutations.where("entityId").equals(entityId).toArray();
    expect(totalForEntity).toHaveLength(2);
  });
});
