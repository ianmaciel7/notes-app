import { expect, type Page, test } from "@playwright/test";

const objectStorageKey = "notes-app:workspace-objects:v1";
const sidebarStorageKey = "notes-app:workspace-sidebar:v1";

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

async function openObjectTypeStudio(page: Page) {
  const trigger = page.getByRole("button", {
    name: "Adicionar tipo de objeto",
    exact: true,
  });
  const dialog = page.getByRole("dialog");
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(dialog).toBeVisible({ timeout: 15_000 });
}

async function createCustomStructure(
  page: Page,
  singularName: string,
  pluralName: string,
) {
  await openObjectTypeStudio(page);
  await page
    .locator('[data-slot="app-sidebar-object-type-card"]')
    .filter({ hasText: "Crie o seu próprio" })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nome", { exact: true }).fill(singularName);
  await dialog.getByLabel("Plural do nome", { exact: true }).fill(pluralName);
  await dialog
    .getByRole("button", { name: "Adicionar tipo de objeto", exact: true })
    .click();
  await expect(dialog).toBeHidden();
}

async function createObject(page: Page, type: string, title: string) {
  await page.getByRole("button", { name: "Novo", exact: true }).click();
  await page.locator('[role="option"]').filter({ hasText: type }).click();
  const titleField = page.getByRole("textbox", { name: "Título", exact: true });
  await titleField.fill(title);
  await titleField.blur();
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
  const errors = await openCleanWorkspace(page);
  await createCustomStructure(page, "Book", "Books");
  await createCustomStructure(page, "Person", "People");
  await createObject(page, "Book", "Domain-driven design");
  await createObject(page, "Person", "Ada");
  await createObject(page, "Person", "Grace");

  const seeded = await page.evaluate(
    ({ objectKey, sidebarKey }) => {
      const snapshot = JSON.parse(
        window.localStorage.getItem(objectKey) ?? "null",
      );
      const book = snapshot.structures.find(
        (structure: { singularName: string }) =>
          structure.singularName === "Book",
      );
      const person = snapshot.structures.find(
        (structure: { singularName: string }) =>
          structure.singularName === "Person",
      );
      const source = snapshot.entities.find(
        (entity: { objectTypeId: string; title: string }) =>
          entity.objectTypeId === book.id &&
          entity.title === "Domain-driven design",
      );
      const target = snapshot.entities.find(
        (entity: { objectTypeId: string; title: string }) =>
          entity.objectTypeId === person.id && entity.title === "Ada",
      );

      book.propertyDefinitions.push(
        {
          id: "author",
          inversePropertyDefinitionId: "books",
          multiple: false,
          name: "Author",
          ownership: "normal",
          targetStructureIds: [person.id],
          valueType: "entity",
          writable: true,
        },
        {
          fixedTargetObjectIds: [target.id],
          id: "reviewers",
          multiple: true,
          name: "Reviewers",
          ownership: "normal",
          targetStructureIds: [person.id],
          valueType: "entity",
          writable: true,
        },
      );
      person.propertyDefinitions.push({
        id: "books",
        inversePropertyDefinitionId: "author",
        multiple: true,
        name: "Books",
        ownership: "normal",
        targetStructureIds: [book.id],
        valueType: "entity",
        writable: true,
      });
      source.collections = ["collection:book:reference-shelf"];
      snapshot.activeEntityId = source.id;
      snapshot.version = 5;
      window.localStorage.setItem(objectKey, JSON.stringify(snapshot));
      window.localStorage.setItem(
        sidebarKey,
        JSON.stringify({
          collectionRecords: {
            "collection:book:reference-shelf": {
              id: "collection:book:reference-shelf",
              name: "Reading shelf",
              structureId: book.id,
            },
          },
          customSections: [],
          objectTypeQueries: {},
          version: 2,
        }),
      );
      return { sourceId: source.id, targetId: target.id };
    },
    { objectKey: objectStorageKey, sidebarKey: sidebarStorageKey },
  );

  await page.reload();
  const workspace = objectPage(page);
  await expect(workspace).toBeVisible();
  await expect(
    workspace.locator('[data-slot="workspace-object-page-header"]'),
  ).toContainText("Reading shelf");
  await expect(
    page.locator('[data-slot="app-sidebar-collection-row"]'),
  ).toContainText("Reading shelf");

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
