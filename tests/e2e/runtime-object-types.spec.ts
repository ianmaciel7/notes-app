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
  const trigger = page.getByRole("button", {
    name: "Adicionar tipo de objeto",
    exact: true,
  });
  const dialog = page.getByRole("dialog");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await trigger.click();
    if (await dialog.isVisible()) return;
    await page.waitForTimeout(750);
  }
  await expect(dialog).toBeVisible();
}

async function seedTypedProperties(
  page: Page,
  structureName: string,
  title: string,
) {
  const seeded = await page.evaluate(
    ({ key, structureName: expectedStructureName, title: expectedTitle }) => {
      const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
      const structure = snapshot.structures.find(
        (item: { singularName: string }) =>
          item.singularName === expectedStructureName,
      );
      const entity = snapshot.entities.find(
        (item: { objectTypeId: string; title: string }) =>
          item.objectTypeId === structure.id && item.title === expectedTitle,
      );
      const propertyDefinitions = [
        {
          id: "summary",
          name: "Summary",
          multiple: false,
          ownership: "normal",
          valueType: "text",
          writable: true,
        },
        {
          id: "score",
          name: "Score",
          multiple: false,
          ownership: "normal",
          valueType: "number",
          writable: true,
        },
        {
          id: "ready",
          name: "Ready",
          multiple: false,
          ownership: "normal",
          valueType: "boolean",
          writable: true,
        },
        {
          id: "due",
          name: "Due",
          multiple: false,
          ownership: "normal",
          valueType: "date",
          writable: true,
        },
        {
          id: "source",
          name: "Source",
          multiple: false,
          ownership: "normal",
          valueType: "url",
          writable: true,
        },
      ];
      structure.propertyDefinitions = [
        ...structure.propertyDefinitions,
        ...propertyDefinitions,
      ];
      snapshot.version = 4;
      const raw = JSON.stringify(snapshot);
      window.localStorage.setItem(key, raw);
      return {
        body: entity.body,
        createdAt: entity.createdAt,
        entityId: entity.id,
        propertyValues: entity.propertyValues,
        raw,
        structureId: structure.id,
      };
    },
    { key: storageKey, structureName, title },
  );

  await page.addInitScript(
    ({ key, value }) => {
      if (window.sessionStorage.getItem("typed-property-seed-ready")) return;
      window.localStorage.setItem(key, value);
      window.sessionStorage.setItem("typed-property-seed-ready", "true");
    },
    { key: storageKey, value: seeded.raw },
  );
  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  return seeded;
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
  await page
    .locator("#app-shell-sidebar")
    .getByRole("button", { name: "Novo", exact: true })
    .click();
  await page
    .locator('[role="option"]')
    .filter({ hasText: structureLabel })
    .click();
  await page.getByRole("textbox", { name: "Título", exact: true }).fill(title);
  await page
    .locator(".notes-block-editor:visible")
    .fill(`Conteúdo de ${title}`);
}

test("object type studio keeps keyboard focus and dismisses predictably", async ({
  page,
}) => {
  const errors = await openCleanWorkspace(page);
  const trigger = page.getByRole("button", {
    name: "Adicionar tipo de objeto",
    exact: true,
  });

  await trigger.focus();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page
    .locator('[data-slot="app-sidebar-object-type-card"]')
    .filter({ hasText: "Crie o seu próprio" })
    .click();
  await expect(dialog.getByLabel("Nome", { exact: true })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
  expect(errors).toEqual([]);
});

test("typed property fields validate, preserve system values, and survive migration reload", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const errors = await openCleanWorkspace(page);
  await createCustomStructure(page, "Registro tipado", "Registros tipados");
  await createObject(page, "Registro tipado", "Valores tipados");
  const seeded = await seedTypedProperties(
    page,
    "Registro tipado",
    "Valores tipados",
  );
  const propertyGroup = page
    .locator('[data-slot="workspace-property-group"]')
    .filter({ visible: true });
  const summary = propertyGroup.getByLabel("Summary", { exact: true });
  const score = propertyGroup.getByLabel("Score", { exact: true });
  const ready = propertyGroup.getByLabel("Ready", { exact: true });
  const due = propertyGroup.getByLabel("Due", { exact: true });
  const source = propertyGroup.getByLabel("Source", { exact: true });

  await expect(propertyGroup).toBeVisible();
  await expect(summary).toBeVisible();
  await expect(score).toBeVisible();
  await expect(ready).toBeVisible();
  await expect(due).toBeVisible();
  await expect(source).toBeVisible();
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.type("Typed summary");
  await summary.blur();
  await score.fill("42");
  await score.blur();
  await ready.check();
  await due.fill("2026-09-01T10:30");
  await due.blur();
  await expect(due).toHaveValue("2026-09-01T10:30");
  await source.fill("https://example.com/typed");
  await source.blur();

  const afterEdit = await page.evaluate(
    ({ key, entityId }) => {
      const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
      return {
        activeEntityId: snapshot.activeEntityId,
        entity: snapshot.entities.find(
          (item: { id: string }) => item.id === entityId,
        ),
        version: snapshot.version,
      };
    },
    { key: storageKey, entityId: seeded.entityId },
  );
  expect(afterEdit.version).toBe(5);
  expect(afterEdit.activeEntityId).toBe(seeded.entityId);
  expect(afterEdit.entity.id).toBe(seeded.entityId);
  expect(afterEdit.entity.objectTypeId).toBe(seeded.structureId);
  expect(afterEdit.entity.body).toEqual(seeded.body);
  expect(afterEdit.entity.createdAt).toBe(seeded.createdAt);
  expect(afterEdit.entity.propertyValues.createdAt).toEqual(
    seeded.propertyValues.createdAt,
  );
  expect(afterEdit.entity.propertyValues).toMatchObject({
    ready: { boolean: { checked: true }, type: "boolean" },
    score: { number: { value: 42 }, type: "number" },
    source: { type: "url", url: { value: "https://example.com/typed" } },
    summary: { text: { value: "Typed summary" }, type: "text" },
  });
  expect(afterEdit.entity.propertyValues.due).toMatchObject({
    date: { value: { allDay: false } },
    type: "date",
  });
  expect(afterEdit.entity.propertyValues.due.date.value.timeZone).toBeTruthy();

  await source.fill("not a URL");
  await expect
    .poll(async () =>
      page.evaluate(
        ({ key, entityId }) => {
          const snapshot = JSON.parse(
            window.localStorage.getItem(key) ?? "null",
          );
          return snapshot.entities.find(
            (item: { id: string }) => item.id === entityId,
          ).propertyValues.source.url.value;
        },
        { key: storageKey, entityId: seeded.entityId },
      ),
    )
    .toBe("https://example.com/typed");

  await page.setViewportSize({ width: 390, height: 844 });
  await summary.focus();
  await expect(summary).toBeFocused();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth ===
          document.documentElement.clientWidth,
      ),
    )
    .toBe(true);

  await page.goto("/en", { waitUntil: "domcontentloaded" });
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await expect(
    page.getByRole("button", { name: "Change object type", exact: true }),
  ).toBeVisible();
  const englishPropertyGroup = page
    .locator('[data-slot="workspace-property-group"]')
    .filter({ visible: true });
  await expect(
    englishPropertyGroup.getByLabel("Summary", { exact: true }),
  ).toHaveValue("Typed summary");
  await expect(
    englishPropertyGroup.getByLabel("Source", { exact: true }),
  ).toHaveValue("https://example.com/typed");
  expect(errors).toEqual([]);
});

test("invalid typed values recover atomically without overwriting the source snapshot", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const errors = await openCleanWorkspace(page);
  await createCustomStructure(page, "Conversão segura", "Conversões seguras");
  await createObject(page, "Conversão segura", "Fonte da conversão");
  const seeded = await seedTypedProperties(
    page,
    "Conversão segura",
    "Fonte da conversão",
  );
  const invalidSnapshot = await page.evaluate(
    ({ key, entityId }) => {
      const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
      const entity = snapshot.entities.find(
        (item: { id: string }) => item.id === entityId,
      );
      entity.propertyValues.score = {
        text: { value: "not-a-number" },
        type: "text",
      };
      const raw = JSON.stringify(snapshot);
      window.localStorage.setItem(key, raw);
      return raw;
    },
    { key: storageKey, entityId: seeded.entityId },
  );

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await expect(
    page.getByText(
      "Não foi possível restaurar o espaço salvo. O espaço padrão foi mantido.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate((key) => window.localStorage.getItem(key), storageKey),
    )
    .toBe(invalidSnapshot);
  expect(errors).toEqual([]);
});

test("object type conversion cancellation preserves the original typed entity", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const errors = await openCleanWorkspace(page);
  await createCustomStructure(page, "Plano conversível", "Planos conversíveis");
  await createObject(page, "Plano conversível", "Objeto preservado");
  const seeded = await seedTypedProperties(
    page,
    "Plano conversível",
    "Objeto preservado",
  );

  const beforeConversion = await page.evaluate(
    ({ key, entityId }) => {
      const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
      return snapshot.entities.find(
        (item: { id: string }) => item.id === entityId,
      );
    },
    { key: storageKey, entityId: seeded.entityId },
  );

  await page
    .getByRole("button", { name: "Alterar tipo de objeto", exact: true })
    .click();
  await page.getByLabel("Buscar", { exact: true }).fill("Tarefa");
  await page.getByRole("menuitem", { name: "Tarefa", exact: true }).click();
  const planner = page.locator('[data-slot="object-conversion-planner"]');
  await expect(planner).toBeVisible();
  await expect(planner.getByText("createdAt", { exact: true })).toBeVisible();
  await planner.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(planner).toBeHidden();

  const afterCancel = await page.evaluate(
    ({ key, entityId }) => {
      const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
      return snapshot.entities.find(
        (item: { id: string }) => item.id === entityId,
      );
    },
    { key: storageKey, entityId: seeded.entityId },
  );
  expect(afterCancel).toEqual(beforeConversion);
  expect(errors).toEqual([]);
});

test("object type conversion commit preserves mapped typed values", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const errors = await openCleanWorkspace(page);
  await createCustomStructure(page, "Origem mapeada", "Origens mapeadas");
  await createCustomStructure(page, "Destino mapeado", "Destinos mapeados");
  await createObject(page, "Origem mapeada", "Valor confirmado");
  const seeded = await page.evaluate((key) => {
    const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
    const sourceStructure = snapshot.structures.find(
      (item: { singularName: string }) =>
        item.singularName === "Origem mapeada",
    );
    const targetStructure = snapshot.structures.find(
      (item: { singularName: string }) =>
        item.singularName === "Destino mapeado",
    );
    const sourceEntity = snapshot.entities.find(
      (item: { objectTypeId: string; title: string }) =>
        item.objectTypeId === sourceStructure.id &&
        item.title === "Valor confirmado",
    );
    sourceStructure.propertyDefinitions = [
      ...sourceStructure.propertyDefinitions,
      {
        id: "summary",
        multiple: false,
        name: "Summary",
        ownership: "normal",
        valueType: "text",
        writable: true,
      },
    ];
    targetStructure.propertyDefinitions = [
      ...targetStructure.propertyDefinitions,
      {
        id: "notes",
        multiple: false,
        name: "Notes",
        ownership: "normal",
        valueType: "text",
        writable: true,
      },
    ];
    sourceEntity.propertyValues.summary = {
      text: { value: "Mapped in browser" },
      type: "text",
    };
    const raw = JSON.stringify(snapshot);
    window.localStorage.setItem(key, raw);
    return {
      entityId: sourceEntity.id,
      raw,
      sourceUpdatedAt:
        sourceEntity.propertyValues.lastUpdatedAt.lastUpdatedAt.value,
      targetStructureId: targetStructure.id,
    };
  }, storageKey);
  await page.addInitScript(
    ({ key, value }) => {
      if (window.sessionStorage.getItem("conversion-commit-seed-ready")) {
        return;
      }
      window.localStorage.setItem(key, value);
      window.sessionStorage.setItem("conversion-commit-seed-ready", "true");
    },
    { key: storageKey, value: seeded.raw },
  );
  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();

  await page
    .getByRole("button", { name: "Alterar tipo de objeto", exact: true })
    .click();
  await page.getByLabel("Buscar", { exact: true }).fill("Destino mapeado");
  await page
    .getByRole("menuitem", { name: "Destino mapeado", exact: true })
    .click();
  const planner = page.locator('[data-slot="object-conversion-planner"]');
  await expect(planner).toBeVisible();
  await planner
    .locator("li")
    .filter({ hasText: "createdAt" })
    .getByRole("combobox")
    .selectOption("__discard__");
  await planner
    .locator("li")
    .filter({ hasText: "lastUpdatedAt" })
    .getByRole("combobox")
    .selectOption("__discard__");
  await planner
    .locator("li")
    .filter({ hasText: "summary" })
    .getByRole("combobox")
    .selectOption("notes");
  await planner
    .getByRole("button", { name: "Mudar Tipo", exact: true })
    .click();
  await expect(planner).toBeHidden();

  const converted = await page.evaluate(
    ({ key, entityId }) => {
      const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
      return snapshot.entities.find(
        (item: { id: string }) => item.id === entityId,
      );
    },
    { key: storageKey, entityId: seeded.entityId },
  );
  expect(converted.objectTypeId).toBe(seeded.targetStructureId);
  expect(converted.propertyValues.notes).toEqual({
    text: { value: "Mapped in browser" },
    type: "text",
  });
  expect("summary" in converted.propertyValues).toBe(false);
  expect(converted.propertyValues.lastUpdatedAt.lastUpdatedAt.value).not.toBe(
    seeded.sourceUpdatedAt,
  );
  expect(errors).toEqual([]);
});

test("runtime custom Structure creates objects once and survives reload", async ({
  page,
}) => {
  const errors = await openCleanWorkspace(page);
  await createCustomStructure(page, "Nota de pesquisa", "Notas de pesquisa");

  await createObject(page, "Nota de pesquisa", "Primeira pesquisa");
  await createObject(page, "Nota de pesquisa", "Segunda pesquisa");

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

test("preset instances are independent, guarded, and propagate metadata canonically", async ({
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

  await createObject(page, "Livro de estudo", "Livro guardado");
  const renamedTargetRow = page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Livros de estudo" });
  await renamedTargetRow.hover();
  await renamedTargetRow
    .getByRole("button", { name: "Ações de Livros de estudo", exact: true })
    .click();
  await page.getByText("Excluir tipo de objeto", { exact: true }).click();
  await expect(
    page.getByText("Não foi possível alterar o tipo de objeto.", {
      exact: true,
    }),
  ).toBeVisible();
  const afterBlockedDelete = await page.evaluate(
    ({ key, id }) => {
      const snapshot = JSON.parse(window.localStorage.getItem(key) ?? "null");
      return {
        entityCount: snapshot.entities.filter(
          (item: { objectTypeId: string }) => item.objectTypeId === id,
        ).length,
        structureCount: snapshot.structures.filter(
          (item: { id: string }) => item.id === id,
        ).length,
      };
    },
    { key: storageKey, id: presetIds[1] },
  );
  expect(afterBlockedDelete).toEqual({ entityCount: 1, structureCount: 1 });
  expect(errors).toEqual([]);
});

test("unknown Structure references recover without overwriting invalid storage", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  const invalidSnapshot = JSON.stringify({
    activeEntityId: "entity-1",
    entities: [
      {
        body: {
          doc: { content: [{ type: "paragraph" }], type: "doc" },
          schemaVersion: 1,
        },
        collections: [],
        createdAt: "2026-08-25T00:00:00.000Z",
        id: "entity-1",
        kind: "document",
        objectTypeId: "missing-runtime-structure",
        tags: [],
        title: "Fonte preservada",
      },
    ],
    nextId: 2,
    structures: [],
    version: 4,
  });
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, value);
    },
    { key: storageKey, value: invalidSnapshot },
  );
  await page.goto("/pt-BR", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await expect(
    page.getByText(
      "Não foi possível restaurar o espaço salvo. O espaço padrão foi mantido.",
      { exact: true },
    ),
  ).toBeVisible();
  await page.waitForTimeout(750);
  await expect
    .poll(async () =>
      page.evaluate((key) => window.localStorage.getItem(key), storageKey),
    )
    .toBe(invalidSnapshot);
  expect(errors).toEqual([]);
});
