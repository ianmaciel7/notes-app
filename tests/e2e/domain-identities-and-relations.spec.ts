import { expect, type Page, test } from "@playwright/test";
import { serializeWorkspaceObjectState } from "../../src/lib/workspace-object-storage";
import { createCustomStructure } from "../../src/lib/workspace-object-types";
import {
  createInitialWorkspaceObjectState,
  workspaceObjectReducer,
} from "../../src/lib/workspace-objects";

const objectStorageKey = "notes-app:workspace-objects:v1";
const sidebarStorageKey = "notes-app:workspace-sidebar:v1";

function reduceWorkspaceObjects(
  state: ReturnType<typeof createInitialWorkspaceObjectState>,
  ...actions: Parameters<typeof workspaceObjectReducer>[1][]
) {
  return actions.reduce(workspaceObjectReducer, state);
}

function createSeededWorkspace() {
  const author = {
    id: "author",
    inversePropertyDefinitionId: "books",
    multiple: false,
    name: "Author",
    ownership: "normal",
    targetStructureIds: ["person-custom"],
    valueType: "entity",
    writable: true,
  } as const;
  const reviewers = {
    fixedTargetObjectIds: ["created-person-custom-2"],
    id: "reviewers",
    multiple: true,
    name: "Reviewers",
    ownership: "normal",
    targetStructureIds: ["person-custom"],
    valueType: "entity",
    writable: true,
  } as const;
  const books = {
    id: "books",
    inversePropertyDefinitionId: "author",
    multiple: true,
    name: "Books",
    ownership: "normal",
    targetStructureIds: ["book-custom"],
    valueType: "entity",
    writable: true,
  } as const;
  const bookStructure = createCustomStructure(
    createInitialWorkspaceObjectState().structures,
    {
      iconName: "book",
      lifecycleKind: "document",
      pluralName: "Books",
      propertyDefinitions: [author, reviewers],
      singularName: "Book",
      tone: "purple",
    },
    () => "book-custom",
  );
  if (!bookStructure.ok) throw new Error(bookStructure.error.message);
  const personStructure = createCustomStructure(
    bookStructure.value,
    {
      iconName: "person",
      lifecycleKind: "document",
      pluralName: "People",
      propertyDefinitions: [books],
      singularName: "Person",
      tone: "orange",
    },
    () => "person-custom",
  );
  if (!personStructure.ok) throw new Error(personStructure.error.message);
  const structures = personStructure.value;
  const state = reduceWorkspaceObjects(
    { ...createInitialWorkspaceObjectState(), structures },
    { type: "beginCreate", objectTypeId: "book-custom" },
    { type: "beginCreate", objectTypeId: "person-custom" },
    { type: "beginCreate", objectTypeId: "person-custom" },
    {
      id: "created-book-custom-1",
      patch: {
        collections: ["collection:book:reference-shelf"],
        title: "Domain-driven design",
      },
      type: "updateEntity",
    },
    {
      id: "created-person-custom-2",
      patch: { title: "Ada" },
      type: "updateEntity",
    },
    {
      id: "created-person-custom-3",
      patch: { title: "Grace" },
      type: "updateEntity",
    },
    { type: "selectEntity", id: "created-book-custom-1" },
  );

  return {
    objectSnapshot: serializeWorkspaceObjectState(state),
    sidebarSnapshot: JSON.stringify({
      collectionRecords: {
        "collection:book:reference-shelf": {
          id: "collection:book:reference-shelf",
          name: "Reading shelf",
          structureId: "book-custom",
        },
        "collection:book:reference-shelf-duplicate": {
          id: "collection:book:reference-shelf-duplicate",
          name: "Reading shelf",
          structureId: "book-custom",
        },
      },
      customSections: [],
      objectTypeQueries: {},
      version: 2,
    }),
    sourceId: "created-book-custom-1",
    targetId: "created-person-custom-2",
  };
}

async function openCleanWorkspace(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    if (window.sessionStorage.getItem("domain-identities-ready")) return;
    window.localStorage.clear();
    window.sessionStorage.setItem("domain-identities-ready", "true");
  });
  await page.goto("/pt-BR", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.waitForTimeout(750);
  return errors;
}

function objectPage(page: Page) {
  return page
    .locator('[data-slot="workspace-object-page-view"]')
    .filter({ visible: true });
}

test("stable collection ids and paired Object Select values survive rename and reload", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const seeded = createSeededWorkspace();
  const errors = await openCleanWorkspace(page);
  await page.evaluate(({ objectSnapshot, sidebarSnapshot }) => {
    window.localStorage.setItem(
      "notes-app:workspace-objects:v1",
      objectSnapshot,
    );
    window.localStorage.setItem(
      "notes-app:workspace-sidebar:v1",
      sidebarSnapshot,
    );
  }, seeded);
  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();

  const workspace = objectPage(page);
  await expect(workspace).toBeVisible();
  await expect(
    workspace.locator('[data-slot="workspace-object-page-header"]'),
  ).toContainText("Reading shelf");
  await expect(
    page
      .locator('[data-slot="app-sidebar-collection-row"]')
      .filter({ hasText: "Reading shelf" }),
  ).toHaveCount(2);
  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Books" })
    .locator("button")
    .filter({ hasText: "Books" })
    .click();
  await page.getByRole("tab", { name: "Visão geral", exact: true }).click();
  await page
    .locator('[data-slot="object-type-overview"]')
    .evaluate((element) => element.scrollTo(0, element.scrollHeight));
  const duplicateCollectionName = page
    .locator('[data-slot="object-type-named-card"][data-kind="collection"]')
    .getByRole("textbox", { name: "Reading shelf" })
    .nth(1);
  await expect(duplicateCollectionName).toHaveValue("Reading shelf");
  await duplicateCollectionName.fill("Research shelf");
  await duplicateCollectionName.blur();
  await expect
    .poll(async () =>
      page.evaluate(
        ({ sidebarKey }) => {
          const sidebar = JSON.parse(
            window.localStorage.getItem(sidebarKey) ?? "null",
          );
          return {
            first:
              sidebar.collectionRecords["collection:book:reference-shelf"].name,
            second:
              sidebar.collectionRecords[
                "collection:book:reference-shelf-duplicate"
              ].name,
          };
        },
        { sidebarKey: sidebarStorageKey },
      ),
    )
    .toEqual({ first: "Reading shelf", second: "Research shelf" });
  await page
    .locator('[data-slot="app-sidebar-collection-row"]')
    .filter({ hasText: "Reading shelf" })
    .getByLabel("Mais opções: Reading shelf")
    .click();
  await page
    .getByRole("menuitem", { name: "Excluir coleção", exact: true })
    .click();
  await expect(
    page.getByText("Este objeto não pode ser excluído"),
  ).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate(
        ({ objectKey, sidebarKey, sourceId }) => {
          const snapshot = JSON.parse(
            window.localStorage.getItem(objectKey) ?? "null",
          );
          const sidebar = JSON.parse(
            window.localStorage.getItem(sidebarKey) ?? "null",
          );
          const source = snapshot.entities.find(
            (entity: { id: string }) => entity.id === sourceId,
          );
          return {
            collectionExists:
              "collection:book:reference-shelf" in sidebar.collectionRecords,
            memberships: source.collections,
          };
        },
        {
          objectKey: objectStorageKey,
          sidebarKey: sidebarStorageKey,
          sourceId: seeded.sourceId,
        },
      ),
    )
    .toEqual({
      collectionExists: true,
      memberships: ["collection:book:reference-shelf"],
    });
  await page.evaluate(
    ({ objectKey, sourceId }) => {
      const snapshot = JSON.parse(
        window.localStorage.getItem(objectKey) ?? "null",
      );
      snapshot.activeEntityId = sourceId;
      window.localStorage.setItem(objectKey, JSON.stringify(snapshot));
    },
    { objectKey: objectStorageKey, sourceId: seeded.sourceId },
  );
  await page.reload();
  await expect(workspace).toBeVisible();

  const author = workspace.getByLabel("Author", { exact: true });
  const reviewers = workspace.getByLabel("Reviewers", { exact: true });
  await author.selectOption(seeded.targetId);
  await reviewers.selectOption([seeded.targetId]);
  await expect(reviewers.locator("option")).toHaveCount(1);

  await expect
    .poll(async () =>
      page.evaluate(
        ({ key, sourceId, targetId }) => {
          const snapshot = JSON.parse(
            window.localStorage.getItem(key) ?? "null",
          );
          const source = snapshot.entities.find(
            (entity: { id: string }) => entity.id === sourceId,
          );
          const target = snapshot.entities.find(
            (entity: { id: string }) => entity.id === targetId,
          );
          return {
            inverse: target.propertyValues.books.entity.map(
              (item: { id: string }) => item.id,
            ),
            source: source.propertyValues.author.entity.map(
              (item: { id: string }) => item.id,
            ),
          };
        },
        {
          key: objectStorageKey,
          sourceId: seeded.sourceId,
          targetId: seeded.targetId,
        },
      ),
    )
    .toEqual({ inverse: [seeded.sourceId], source: [seeded.targetId] });

  await workspace
    .getByRole("button", { name: "Mais opções", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Excluir Objeto", exact: true })
    .click();
  await expect
    .poll(async () =>
      page.evaluate(
        ({ key, targetId }) =>
          JSON.parse(window.localStorage.getItem(key) ?? "null").entities.some(
            (entity: { id: string }) => entity.id === targetId,
          ),
        { key: objectStorageKey, targetId: seeded.targetId },
      ),
    )
    .toBe(true);

  await author.selectOption([]);
  await expect
    .poll(async () =>
      page.evaluate(
        ({ key, targetId }) => {
          const snapshot = JSON.parse(
            window.localStorage.getItem(key) ?? "null",
          );
          return snapshot.entities.find(
            (entity: { id: string }) => entity.id === targetId,
          ).propertyValues.books.entity;
        },
        { key: objectStorageKey, targetId: seeded.targetId },
      ),
    )
    .toEqual([]);

  await page.addInitScript((key) => {
    const sidebar = JSON.parse(window.localStorage.getItem(key) ?? "null");
    sidebar.collectionRecords["collection:book:reference-shelf"].name =
      "Reference shelf";
    window.localStorage.setItem(key, JSON.stringify(sidebar));
  }, sidebarStorageKey);
  await page.reload();
  await expect(workspace).toBeVisible();
  await expect(
    workspace.locator('[data-slot="workspace-object-page-header"]'),
  ).toContainText("Reference shelf");
  await expect(author).toHaveValue("");
  expect(errors).toEqual([]);
});
