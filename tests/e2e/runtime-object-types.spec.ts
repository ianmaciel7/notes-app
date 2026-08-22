import { expect, type Page, test } from "@playwright/test";

const storageKey = "notes-app:workspace-objects:v1";

async function openCleanWorkspace(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    if (window.sessionStorage.getItem("runtime-structure-test-ready")) return;
    window.localStorage.clear();
    window.sessionStorage.setItem("runtime-structure-test-ready", "true");
  });
  await page.goto("/pt-BR", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.waitForTimeout(750);
  return errors;
}

async function openObjectTypeStudio(page: Page) {
  const trigger = page.locator(
    '[data-slot="app-sidebar-object-type-studio"] [data-slot="app-sidebar-section-action"]',
  );
  const dialog = page.getByRole("dialog");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await trigger.click();
    if (await dialog.isVisible()) return;
    await page.waitForTimeout(750);
  }
  await expect(dialog).toBeVisible();
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

async function createObject(page: Page, structureLabel: string, title: string) {
  await page.getByRole("button", { name: "Novo", exact: true }).click();
  await page
    .locator('[role="option"]')
    .filter({ hasText: structureLabel })
    .click();
  await page.getByRole("textbox", { name: "Título", exact: true }).fill(title);
  await page
    .locator(".notes-block-editor:visible")
    .fill(`Conteúdo de ${title}`);
}

test("runtime custom Structure creates objects once and survives reload", async ({
  page,
}) => {
  const errors = await openCleanWorkspace(page);
  await createCustomStructure(page, "Nota de pesquisa", "Notas de pesquisa");

  await createObject(page, "Notas de pesquisa", "Primeira pesquisa");
  await createObject(page, "Notas de pesquisa", "Segunda pesquisa");

  const beforeReload = await page.evaluate((key) => {
    const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
    const structure = snapshot.structures.find(
      (item: { singularName: string }) =>
        item.singularName === "Nota de pesquisa",
    );
    return {
      structure,
      entities: snapshot.entities.filter(
        (item: { objectTypeId: string }) => item.objectTypeId === structure.id,
      ),
    };
  }, storageKey);
  expect(beforeReload.structure.ownership).toBe("custom");
  expect(beforeReload.entities).toHaveLength(2);
  expect(
    new Set(beforeReload.entities.map((item: { id: string }) => item.id)).size,
  ).toBe(2);

  const row = page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Notas de pesquisa" });
  await expect(row).toContainText("2");

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await expect(row).toContainText("2");
  const afterReload = await page.evaluate((key) => {
    const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return {
      ids: snapshot.structures
        .filter(
          (item: { singularName: string }) =>
            item.singularName === "Nota de pesquisa",
        )
        .map((item: { id: string }) => item.id),
      entityIds: snapshot.entities
        .filter((item: { objectTypeId: string }) =>
          snapshot.structures.some(
            (structure: { id: string; singularName: string }) =>
              structure.id === item.objectTypeId &&
              structure.singularName === "Nota de pesquisa",
          ),
        )
        .map((item: { id: string }) => item.id),
    };
  }, storageKey);
  expect(afterReload.ids).toEqual([beforeReload.structure.id]);
  expect(afterReload.entityIds).toEqual(
    beforeReload.entities.map((item: { id: string }) => item.id),
  );
  expect(errors).toEqual([]);
});

test("preset instances are independent and metadata propagates canonically", async ({
  page,
}) => {
  const errors = await openCleanWorkspace(page);

  for (let index = 0; index < 2; index += 1) {
    await openObjectTypeStudio(page);
    await page
      .locator('[data-slot="app-sidebar-object-type-card"]')
      .filter({ hasText: "Livro" })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Adicionar tipo de objeto", exact: true })
      .click();
  }

  const presetIds = await page.evaluate((key) => {
    const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return snapshot.structures
      .filter(
        (item: { ownership: string; singularName: string }) =>
          item.ownership === "custom" && item.singularName === "Book",
      )
      .map((item: { id: string }) => item.id);
  }, storageKey);
  expect(presetIds).toHaveLength(2);
  expect(new Set(presetIds).size).toBe(2);

  const rows = page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Books" });
  const targetRow = rows.last();
  await targetRow.hover();
  await targetRow
    .getByRole("button", { name: "Ações de Books", exact: true })
    .click();
  await page
    .getByText("Configurações do tipo de objeto", { exact: true })
    .click();

  const settings = page.getByRole("dialog");
  await settings.getByLabel("Nome", { exact: true }).fill("Livro de estudo");
  await settings
    .getByLabel("Plural do nome", { exact: true })
    .fill("Livros de estudo");
  await settings.locator("select").nth(0).selectOption("idea");
  await settings.locator("select").nth(1).selectOption("amber");
  await settings.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(
    page
      .locator('[data-slot="app-sidebar-object-type-row"]')
      .filter({ hasText: "Livros de estudo" }),
  ).toBeVisible();
  const updated = await page.evaluate(
    ({ key, id }) => {
      const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
      return snapshot.structures.find((item: { id: string }) => item.id === id);
    },
    { key: storageKey, id: presetIds[1] },
  );
  expect(updated).toMatchObject({
    singularName: "Livro de estudo",
    pluralName: "Livros de estudo",
    iconName: "idea",
    tone: "amber",
  });
  expect(errors).toEqual([]);
});
