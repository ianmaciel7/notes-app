import { expect, type Locator, type Page, test } from "@playwright/test";

const desktopViewports = [
  { width: 1536, height: 912 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 720 },
] as const;
const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

async function openWorkspace(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/pt-BR");
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.waitForTimeout(750);
  return errors;
}

function objectTypeWorkspace(page: Page) {
  return page
    .locator(
      [
        '[data-slot="object-type-workspace"]',
        '[data-slot="workspace-object-type-view"]',
      ].join(","),
    )
    .filter({
      visible: true,
    });
}

function createdObjectWorkspace(page: Page) {
  return page
    .locator(
      [
        '[data-slot="created-object-workspace"]',
        '[data-slot="workspace-object-page-view"]',
      ].join(","),
    )
    .filter({
      visible: true,
    });
}

async function createPageObject(page: Page) {
  await page.getByRole("button", { name: "Novo", exact: true }).click();
  await page.locator('[role="option"]').filter({ hasText: "Página" }).click();
  const workspace = createdObjectWorkspace(page);
  await expect(workspace).toBeVisible();
  return (await workspace.getAttribute("data-object-type")) ?? "page";
}

async function selectNewObject(page: Page, label: string) {
  await page.getByRole("button", { name: "Novo", exact: true }).click();
  await page.locator('[role="option"]').filter({ hasText: label }).click();
}

async function persistedEntities(page: Page) {
  return page.evaluate(() => {
    const value = window.localStorage.getItem("notes-app:workspace-objects:v1");
    return value ? JSON.parse(value).entities : [];
  });
}

async function persistedSnapshot(page: Page) {
  return page.evaluate(() => {
    const value = window.localStorage.getItem("notes-app:workspace-objects:v1");
    return value ? JSON.parse(value) : null;
  });
}

async function expectStableBoxOnHover(target: Locator) {
  const idleBox = await target.boundingBox();
  expect(idleBox).toBeTruthy();
  await target.hover();
  expect(await target.boundingBox()).toEqual(idleBox);
}

async function openObjectTypeStudio(page: Page) {
  const trigger = page.locator(
    '[data-slot="app-sidebar-object-type-studio"] [data-slot="app-sidebar-section-action"]',
  );
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

async function createStructureFromPreset(page: Page, presetLabel: string) {
  await openObjectTypeStudio(page);
  const dialog = page.getByRole("dialog");
  await dialog
    .locator('[data-slot="app-sidebar-object-type-card"]')
    .filter({ hasText: presetLabel })
    .click();
  await expect(
    dialog.locator('[data-lifecycle-contract="object-type-details-panel"]'),
  ).toBeVisible();
  await dialog
    .getByRole("button", { name: "Adicionar tipo de objeto", exact: true })
    .click();
  await expect(dialog).toBeHidden();
}

async function createCustomStructure(
  page: Page,
  singularName: string,
  pluralName: string,
) {
  await openObjectTypeStudio(page);
  const dialog = page.getByRole("dialog");
  await dialog
    .locator('[data-slot="app-sidebar-object-type-card"]')
    .filter({ hasText: "Crie o seu próprio" })
    .click();
  await expect(
    dialog.locator('[data-lifecycle-contract="custom-object-type-form"]'),
  ).toHaveAttribute("data-selected", "true");
  await dialog.getByLabel("Nome", { exact: true }).fill(singularName);
  await dialog.getByLabel("Plural do nome", { exact: true }).fill(pluralName);
  await dialog
    .getByRole("button", { name: "Adicionar tipo de objeto", exact: true })
    .click();
  await expect(dialog).toBeHidden();
}

async function writeCreatedObjectTitle(page: Page, title: string) {
  const workspace = createdObjectWorkspace(page);
  await expect(workspace).toBeVisible();
  await workspace.getByRole("textbox", { name: "Título" }).fill(title);
  await workspace.getByRole("textbox", { name: "Título" }).blur();
}

async function expectCreatedObjectProjection(
  page: Page,
  objectTypeId: string,
  pluralLabel: string,
  title: string,
) {
  const row = page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: pluralLabel })
    .first();
  await expect(row).toContainText("1");
  await row
    .getByRole("button")
    .filter({ hasText: pluralLabel })
    .first()
    .click();
  await page.getByRole("tab", { name: "Tudo", exact: true }).click();
  const projection = page
    .locator('[data-lifecycle-contract="object-projection-row"]')
    .filter({ hasText: title })
    .first();
  await expect(projection).toBeVisible();
  await projection.hover();
  await projection.focus();
  await expect(projection).toBeFocused();
  await projection.click();
  await expect(
    page
      .locator(
        [
          `[data-slot="created-object-workspace"][data-object-type="${objectTypeId}"]`,
          `[data-slot="workspace-object-page-view"][data-object-type="${objectTypeId}"]`,
        ].join(","),
      )
      .first(),
  ).toBeVisible();
  await expect(
    page
      .locator(`[data-tab-id^="created-${objectTypeId}-"] [role="tab"]`)
      .first(),
  ).toHaveAttribute("aria-selected", "true");
  await expectActiveEditorTitle(page, title);
}

async function expectActiveEditorTitle(page: Page, title: string) {
  await expect(createdObjectWorkspace(page)).toBeVisible();
  const titleControl = createdObjectWorkspace(page).getByRole("textbox", {
    name: "Título",
  });
  await expect(titleControl).toBeVisible();
  await expect
    .poll(() =>
      titleControl.evaluate((element) =>
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
          ? element.value
          : (element.textContent ?? "").trim(),
      ),
    )
    .toBe(title);
}

for (const viewport of desktopViewports) {
  test(`desktop geometry ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = await openWorkspace(page);
    const sidebar = page.locator("#app-shell-sidebar");
    const main = page.locator("#app-shell-main");

    await expect(sidebar).toBeVisible();
    await expect
      .poll(async () => (await sidebar.boundingBox())?.width)
      .toBeCloseTo(224, 0);
    await expect
      .poll(async () => (await main.boundingBox())?.width ?? 0)
      .toBeGreaterThan(0);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth ===
            document.documentElement.clientWidth,
        ),
      )
      .toBe(true);
    expect(errors).toEqual([]);
  });
}

test("tab midpoint and dedicated actions do not overlap", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 720 });
  const errors = await openWorkspace(page);
  const target = page
    .locator(
      '[aria-label="Workspace tabs"] [role="tab"][aria-selected="false"]',
    )
    .first();
  const targetId = await target.evaluate((element) =>
    element.closest("[data-tab-id]")?.getAttribute("data-tab-id"),
  );
  expect(targetId).toBeTruthy();
  const targetBox = await target.boundingBox();
  expect(targetBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(targetBox?.height ?? 0).toBeGreaterThanOrEqual(32);

  await target.click({ position: { x: 22, y: 16 } });
  await expect(page.locator(`[data-tab-id="${targetId}"]`)).toHaveAttribute(
    "data-tab-active",
    "true",
  );

  const selectedTab = page.locator(`[data-tab-id="${targetId}"] [role="tab"]`);
  const selectedContainer = selectedTab.locator("..");
  await selectedContainer.hover();
  const actions = selectedContainer.locator(
    '[data-slot="app-header-tab-action"]',
  );
  for (const action of await actions.all()) {
    const actionBox = await action.boundingBox();
    expect(
      actionBox && targetBox
        ? actionBox.x >= targetBox.x + targetBox.width
        : true,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("workspace tab header state survives reload", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/pt-BR");
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.waitForTimeout(750);

  const tabList = page.locator('[aria-label="Workspace tabs"]');
  const quoteWrapper = tabList.locator('[data-tab-id="quote"]');
  await quoteWrapper.getByRole("tab").click();
  await expect(quoteWrapper.getByRole("tab")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await quoteWrapper.hover();
  await quoteWrapper.getByRole("button", { name: "Pin tab" }).click();
  await expect(
    quoteWrapper.getByRole("button", { name: "Unpin tab" }),
  ).toBeVisible();

  const pageWrapper = tabList.locator('[data-tab-id="page"]');
  await pageWrapper.hover();
  await pageWrapper.getByRole("button", { name: "Close tab" }).click();

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const value = window.localStorage.getItem(
          "notes-app:workspace-tabs:v1",
        );
        return value ? JSON.parse(value).main : null;
      }),
    )
    .toMatchObject({
      value: "quote",
      tabs: expect.arrayContaining([
        expect.objectContaining({ id: "quote", pinned: true }),
      ]),
    });

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();

  await expect(
    tabList.locator('[data-tab-id="quote"] [role="tab"]').filter({
      visible: true,
    }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(tabList.locator('[data-tab-id="page"]')).toHaveCount(0);
  await quoteWrapper.hover();
  await expect(
    quoteWrapper.getByRole("button", { name: "Unpin tab" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("closed entity tabs stay closed after reload", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);

  const [entity] = await persistedEntities(page);
  expect(entity?.id).toBeTruthy();

  const tabList = page.locator('[aria-label="Workspace tabs"]');
  const entityWrapper = tabList.locator(`[data-tab-id="${entity.id}"]`);
  await expect(entityWrapper.getByRole("tab")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await entityWrapper.hover();
  await entityWrapper.getByRole("button", { name: "Close tab" }).click();
  await expect(entityWrapper).toHaveCount(0);

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const value = window.localStorage.getItem(
          "notes-app:workspace-tabs:v1",
        );
        return value ? JSON.parse(value).main.tabs : [];
      }),
    )
    .not.toContainEqual(expect.objectContaining({ id: entity.id }));

  await page.evaluate((closedEntityId) => {
    const key = "notes-app:workspace-objects:v1";
    const value = window.localStorage.getItem(key);
    if (!value) return;
    const snapshot = JSON.parse(value);
    snapshot.activeEntityId = closedEntityId;
    window.localStorage.setItem(key, JSON.stringify(snapshot));
  }, entity.id);

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await expect(tabList.locator(`[data-tab-id="${entity.id}"]`)).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("top shell controls share one vertical center", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const switcher = page.locator('[data-slot="app-sidebar-space-switcher"]');
  const sidebarTrigger = page.locator(
    '[data-slot="app-shell-sidebar-trigger"] button',
  );
  const history = page.locator('[data-slot="app-header-history"]');
  const switcherBox = await switcher.boundingBox();
  const sidebarTriggerBox = await sidebarTrigger.boundingBox();
  const historyBox = await history.boundingBox();

  expect(switcherBox).toBeTruthy();
  expect(sidebarTriggerBox).toBeTruthy();
  expect(historyBox).toBeTruthy();

  const switcherCenter = (switcherBox?.y ?? 0) + (switcherBox?.height ?? 0) / 2;
  const sidebarTriggerCenter =
    (sidebarTriggerBox?.y ?? 0) + (sidebarTriggerBox?.height ?? 0) / 2;
  const historyCenter = (historyBox?.y ?? 0) + (historyBox?.height ?? 0) / 2;
  expect(
    Math.max(switcherCenter, sidebarTriggerCenter, historyCenter) -
      Math.min(switcherCenter, sidebarTriggerCenter, historyCenter),
  ).toBeLessThanOrEqual(2);
  expect(errors).toEqual([]);
});

test("compound type chip separates navigation from disclosure", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);

  const primary = page
    .locator('[data-slot="compound-chip-primary"]')
    .filter({ visible: true });
  const disclosure = page.getByRole("button", {
    name: "Alterar tipo de objeto",
    exact: true,
  });
  await expect(primary).toHaveText(/Página/);
  await page.mouse.move(5, 5);
  await disclosure.click();
  const search = page.getByRole("textbox", { name: "Buscar", exact: true });
  await expect(search).toBeVisible();
  const menu = page.locator('[data-slot="dropdown-menu-content"][data-open]');
  await expect
    .poll(async () => (await menu.boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(253);
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();
  await expect(disclosure).toBeFocused();

  await primary.click();
  await expect(
    page.getByRole("button", { name: "Páginas", exact: true }).locator(".."),
  ).toHaveAttribute("data-active", "true");
  expect(errors).toEqual([]);
});

test("sidebar row and nested menu keep distinct full-row targets", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const row = page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" });
  const primary = row.getByRole("button").filter({ hasText: "Páginas" });

  await primary.click();
  await expect(row).toHaveAttribute("data-active", "true");
  await row.hover();

  const nested = row.getByRole("button", { name: "Ações de Páginas" });
  await expect(nested).toBeVisible();
  const primaryBox = await primary.boundingBox();
  const nestedBox = await nested.boundingBox();
  expect(
    primaryBox && nestedBox
      ? nestedBox.x >= primaryBox.x + primaryBox.width
      : true,
  ).toBe(true);

  await nested.click();
  await expect(
    page.locator('[data-slot="dropdown-menu-content"][data-open]'),
  ).toBeVisible();
  await expect(row).toHaveAttribute("data-active", "true");
  await page.keyboard.press("Escape");
  await expect(nested).toBeFocused();
  expect(errors).toEqual([]);
});

test("object-type New disclosure opens options without creating an object", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Tabelas" })
    .getByRole("button")
    .filter({ hasText: "Tabelas" })
    .click();
  await expect(objectTypeWorkspace(page)).toBeVisible();

  expect(await persistedEntities(page)).toHaveLength(0);
  await objectTypeWorkspace(page)
    .getByRole("button", { name: "Opções de novo objeto", exact: true })
    .click();

  await expect(
    page.locator('[data-slot="dropdown-menu-content"][data-open]'),
  ).toBeVisible();
  expect(await persistedEntities(page)).toHaveLength(0);
  await expect(
    page
      .locator('[data-slot="app-sidebar-object-type-row"]')
      .filter({ hasText: "Tabelas" })
      .first(),
  ).not.toContainText("1");
  expect(errors).toEqual([]);
});

test("empty Table layout keeps table structure and primary empty actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Tabelas" })
    .getByRole("button")
    .filter({ hasText: "Tabelas" })
    .click();
  const workspace = objectTypeWorkspace(page);
  await expect(workspace).toBeVisible();
  await workspace.getByRole("tab", { name: "Visão geral", exact: true }).click();
  await expect(workspace.locator('[data-slot="object-type-overview"]')).toBeVisible();
  await expect(workspace).toContainText(
    "Os objetos que você acessou recentemente aparecerão aqui.",
  );

  await workspace.getByRole("tab", { name: "Tudo", exact: true }).click();
  await workspace.getByRole("button", { name: "Tabela", exact: true }).click();

  await expect(workspace.getByRole("table")).toBeVisible();
  const emptyState = workspace.locator('[data-slot="workspace-empty-state"]');
  await expect(emptyState).toBeVisible();
  await expect(
    emptyState.getByRole("button", { name: "Importar", exact: true }),
  ).toBeVisible();
  await expect(
    emptyState.getByRole("button", { name: "Novo", exact: true }),
  ).toBeVisible();
  expect(await persistedEntities(page)).toHaveLength(0);
  expect(errors).toEqual([]);
});

test("Page embed action persists a schema-valid paragraph embed", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    if (window.sessionStorage.getItem("embed-test-storage-cleared")) return;
    window.localStorage.clear();
    window.sessionStorage.setItem("embed-test-storage-cleared", "true");
  });
  await page.goto("/pt-BR");
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.waitForTimeout(750);

  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Embed target");
  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Embed source");

  const workspace = createdObjectWorkspace(page);
  await workspace
    .locator('[data-slot="workspace-link-picker"]')
    .getByRole("button", { name: /^Vincular / })
    .first()
    .click();
  await workspace.getByRole("button", { name: "Incorporar", exact: true }).click();

  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      const source = entities.find(
        (entity: { title: string }) => entity.title === "Embed source",
      );
      const lastNode = source?.body?.doc?.content?.at(-1);
      return {
        childType: lastNode?.content?.[0]?.type,
        linkMarkType:
          source?.body?.doc?.content
            ?.flatMap((node: { content?: { marks?: { type: string }[] }[] }) =>
              node.content ?? [],
            )
            .flatMap((node: { marks?: { type: string }[] }) => node.marks ?? [])
            .find((mark: { type: string }) => mark.type === "objectLink")
            ?.type,
        topLevelType: lastNode?.type,
      };
    })
    .toEqual({
      childType: "objectEmbed",
      linkMarkType: "objectLink",
      topLevelType: "paragraph",
    });

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.waitForTimeout(750);
  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .getByRole("button")
    .filter({ hasText: "Páginas" })
    .first()
    .click();
  await expect(objectTypeWorkspace(page)).toBeVisible();
  await objectTypeWorkspace(page).getByRole("tab", { name: "Tudo" }).click();
  await objectTypeWorkspace(page)
    .getByRole("button", { name: "Abrir: Embed source", exact: true })
    .click();
  await expect(createdObjectWorkspace(page)).toBeVisible();
  await expect(
    createdObjectWorkspace(page).getByRole("textbox", {
      name: "Text",
      exact: true,
    }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("Page collapse control changes to an accurate expand name", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await createPageObject(page);
  const workspace = createdObjectWorkspace(page);
  await workspace
    .getByRole("button", { name: "Recolher editor", exact: true })
    .click();

  await expect(
    workspace.getByRole("button", { name: "Expandir editor", exact: true }),
  ).toBeVisible();
  await expect(
    workspace.getByRole("button", { name: "Expandir editor", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(errors).toEqual([]);
});

test("sidebar object rows align and collection rows keep nested indentation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .getByRole("button")
    .filter({ hasText: "Páginas" })
    .click();
  await page.getByRole("tab", { name: "Tudo", exact: true }).click();
  await objectTypeWorkspace(page)
    .getByRole("button", { name: "Mais opções", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Nova coleção" }).click();

  const pageRow = page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" });
  await expect(
    pageRow.locator('[data-slot="app-sidebar-object-type-chevron"]'),
  ).toBeVisible();
  await expect
    .poll(() =>
      pageRow
        .locator('[data-slot="app-sidebar-object-type-chevron"]')
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("0");
  await expect
    .poll(() =>
      pageRow
        .locator('[data-slot="app-sidebar-object-type-icon"]')
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("1");

  await pageRow.hover();
  await expect
    .poll(() =>
      pageRow
        .locator('[data-slot="app-sidebar-object-type-chevron"]')
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("1");
  await expect
    .poll(() =>
      pageRow
        .locator('[data-slot="app-sidebar-object-type-icon"]')
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("0");

  const textColumns = await page.evaluate(() => {
    function visible(element: Element) {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      );
    }

    const expectedLabels = new Set(["Páginas", "Sem título"]);

    return Array.from(
      document.querySelectorAll(
        [
          '[data-slot="app-sidebar-object-type-row"]',
          '[data-slot="app-sidebar-collection-row"]',
        ].join(","),
      ),
    )
      .filter(visible)
      .map((row) => {
        const labels = Array.from(row.querySelectorAll("span"))
          .filter(visible)
          .map((span) => ({
            text: span.textContent?.trim() ?? "",
            left: span.getBoundingClientRect().left,
            className: span.className.toString(),
          }))
          .filter((span) => expectedLabels.has(span.text));
        const label =
          labels.find(
            (span) =>
              span.className.includes("text-[1em]") ||
              span.className === "min-w-0 truncate",
          ) ?? labels.sort((a, b) => b.left - a.left)[0];
        const iconLeft = row.querySelector("svg")?.getBoundingClientRect().left;

        return label
          ? {
              iconLeft,
              text: label.text,
              left: label.left,
            }
          : null;
      })
      .filter(
        (
          row,
        ): row is {
          iconLeft: number;
          text: string;
          left: number;
        } => row !== null && row.iconLeft !== undefined,
      );
  });

  expect(textColumns.map((row) => row.text)).toEqual(
    expect.arrayContaining(["Páginas", "Sem título"]),
  );
  const typeLefts = textColumns
    .filter((row) => row.text !== "Sem título")
    .map((row) => row.left);
  expect(Math.max(...typeLefts) - Math.min(...typeLefts)).toBeLessThanOrEqual(
    1,
  );
  const typeIconLefts = textColumns
    .filter((row) => row.text !== "Sem título")
    .map((row) => row.iconLeft);
  expect(
    Math.max(...typeIconLefts) - Math.min(...typeIconLefts),
  ).toBeLessThanOrEqual(1);
  const typeColumn = typeLefts[0];
  const collectionColumn = textColumns.find(
    (row) => row.text === "Sem título",
  )?.left;
  expect(collectionColumn).toBeDefined();
  const nestedOffset = (collectionColumn ?? typeColumn) - typeColumn;
  expect(nestedOffset).toBeGreaterThanOrEqual(16);
  expect(nestedOffset).toBeLessThanOrEqual(20);
  expect(errors).toEqual([]);
});

test("workspace overflow menu supports submenu, outside click, and Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);
  const trigger = page.getByRole("button", {
    name: "Mais opções",
    exact: true,
  });

  await trigger.click();
  const menu = page
    .locator('[data-slot="dropdown-menu-content"][data-open]')
    .first();
  await expect
    .poll(async () => (await menu.boundingBox())?.width ?? 0)
    .toBeCloseTo(269, 0);
  const rows = menu.locator(
    '[data-slot="dropdown-menu-item"], [data-slot="dropdown-menu-sub-trigger"]',
  );
  for (const row of await rows.all()) {
    expect((await row.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(32);
  }
  await menu.getByText("Personalizar", { exact: true }).hover();
  const customizeSubmenu = page.getByText(
    "Use o botão Personalizar no cabeçalho.",
  );
  await expect(customizeSubmenu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(customizeSubmenu).toBeHidden();
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.mouse.click(5, 300);
  await expect(menu).toBeHidden();
  expect(errors).toEqual([]);
});

test("object type collection and query actions open editable item screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .getByRole("button")
    .filter({ hasText: "Páginas" })
    .click();
  await page.getByRole("tab", { name: "Tudo", exact: true }).click();
  await expect(
    page.getByRole("tab", { name: "Tudo", exact: true }),
  ).toHaveAttribute("aria-selected", "true");

  await objectTypeWorkspace(page)
    .getByRole("button", { name: "Mais opções", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Nova coleção" }).click();

  const collectionScreen = page
    .locator(
      '[data-slot="object-type-named-item-workspace"][data-kind="collection"]',
    )
    .filter({ visible: true });
  await expect(collectionScreen).toBeVisible();
  await expect(collectionScreen).toContainText("Páginas");
  await expect(collectionScreen).toContainText("0 entradas");
  await expect(collectionScreen).toContainText("A visão ainda não está pronta");
  const collectionInput = collectionScreen.getByRole("textbox", {
    name: "Título",
    exact: true,
  });
  await expect(collectionInput).toHaveValue("Sem título");
  await expect(collectionInput).toBeFocused();
  await collectionInput.fill("Coleção local");
  await expect(
    page.locator('[aria-label="Workspace tabs"] [role="tab"]').filter({
      hasText: "Coleção local",
    }),
  ).toHaveAttribute("aria-selected", "true");

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .getByRole("button")
    .filter({ hasText: "Páginas" })
    .click();
  await page.getByRole("tab", { name: "Tudo", exact: true }).click();
  await objectTypeWorkspace(page)
    .getByRole("button", { name: "Mais opções", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Nova query" }).click();

  const queryScreen = page
    .locator(
      '[data-slot="object-type-named-item-workspace"][data-kind="query"]',
    )
    .filter({ visible: true });
  await expect(queryScreen).toBeVisible();
  await expect(queryScreen).toContainText("Páginas");
  await expect(queryScreen).toContainText("0 entradas");
  const queryInput = queryScreen.getByRole("textbox", {
    name: "Título",
    exact: true,
  });
  await expect(queryInput).toHaveValue("Sem título");
  await expect(queryInput).toBeFocused();
  expect(errors).toEqual([]);
});

test("workspace text entry buffers global persistence while typing", async ({
  page,
}) => {
  const typedTitle = "Digitação sem travar no editor";
  const typedBody =
    "Escrever texto longo precisa continuar fluido enquanto o workspace salva depois.";

  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    let workspaceSetItemCount = 0;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === "notes-app:workspace-objects:v1") workspaceSetItemCount += 1;
      return originalSetItem.call(this, key, value);
    };
    Object.defineProperty(window, "__workspaceSetItemCount", {
      value: () => workspaceSetItemCount,
    });
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const pageObjectTypeId = await createPageObject(page);

  const workspace = createdObjectWorkspace(page);
  await expect(workspace).toBeVisible();

  const title = workspace.getByRole("textbox", { name: "Título" });
  await title.click();
  await title.pressSequentially(typedTitle, { delay: 2 });
  await expect(title).toHaveValue(typedTitle);

  const body = workspace.getByRole("textbox", { name: "Text" });
  await body.click();
  await body.pressSequentially(typedBody, { delay: 2 });
  await expect(body).toContainText(typedBody);

  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      const entity = entities.find(
        (candidate: { objectTypeId?: string }) =>
          candidate.objectTypeId === pageObjectTypeId,
      );
      return JSON.stringify(entity ?? {});
    })
    .toContain(typedBody);

  const storageWrites = await page.evaluate(() =>
    (
      window as unknown as {
        __workspaceSetItemCount: () => number;
      }
    ).__workspaceSetItemCount(),
  );
  expect(storageWrites).toBeLessThan(10);
  expect(storageWrites).toBeLessThan(typedTitle.length + typedBody.length);
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 480, height: 844 },
  { width: 390, height: 844 },
] as const) {
  test(`mobile overlays ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors = await openWorkspace(page);
    const mobile = page.locator('[data-slot="app-shell-mobile"]');
    await expect(mobile).toBeVisible();
    expect((await mobile.boundingBox())?.width ?? 0).toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth ===
          document.documentElement.clientWidth,
      ),
    ).toBe(true);

    const navTrigger = page.getByRole("button", { name: "Abrir navegação" });
    await navTrigger.click();
    await expect(page.getByRole("dialog", { name: "Navegação" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Navegação" })).toBeHidden();
    await expect(navTrigger).toBeFocused();

    const contextTrigger = page.getByRole("button", {
      name: "Abrir painel lateral",
    });
    await contextTrigger.click();
    await expect(
      page.getByRole("dialog", { name: "Painel lateral" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(contextTrigger).toBeFocused();
    expect(errors).toEqual([]);
  });
}

test("reduced motion keeps state changes immediate", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const tab = page
    .locator('[aria-label="Workspace tabs"] [role="tab"]')
    .first();
  const transitionProperty = await tab.evaluate(
    (element) => getComputedStyle(element).transitionProperty,
  );
  expect(transitionProperty).toBe("none");

  const newButton = page.getByRole("button", { name: "Novo", exact: true });
  await newButton.focus();
  await expect(newButton).toBeFocused();
  expect(
    await newButton.evaluate((element) => element.matches(":focus-visible")),
  ).toBe(true);
  await newButton.press("Enter");
  const menu = page.locator('[data-slot="popover-content"][data-open]');
  await expect(menu).toBeVisible();
  const menuMotion = await menu.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      animationName: style.animationName,
      transitionProperty: style.transitionProperty,
    };
  });
  expect(menuMotion).toEqual({
    animationName: "none",
    transitionProperty: "none",
  });
  expect(errors).toEqual([]);
});

test("Novo trigger and lifecycle contract consumers expose browser states", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const newButton = page.getByRole("button", { name: "Novo", exact: true });

  await expect(newButton).toHaveAttribute(
    "data-lifecycle-contract",
    "object-creation-trigger",
  );
  await expect(newButton).toHaveAttribute("aria-expanded", "false");
  await expectStableBoxOnHover(newButton);
  await newButton.focus();
  await expect(newButton).toBeFocused();
  expect(
    await newButton.evaluate((element) => element.matches(":focus-visible")),
  ).toBe(true);
  await newButton.hover();
  await page.mouse.down();
  expect(
    await newButton.evaluate((element) => element.matches(":active")),
  ).toBe(true);
  await page.mouse.up();

  const menu = page.locator(
    '[data-lifecycle-contract="object-creation-menu"][data-open]',
  );
  await expect(menu).toBeVisible();
  await expect(newButton).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(newButton).toHaveAttribute("aria-expanded", "false");
  await expect(newButton).toBeFocused();

  await newButton.click();
  await expect(menu).toBeVisible();
  const mainBox = await page.locator("#app-shell-main").boundingBox();
  expect(mainBox).toBeTruthy();
  await page.mouse.click(
    (mainBox?.x ?? 0) + (mainBox?.width ?? 0) - 16,
    (mainBox?.y ?? 0) + (mainBox?.height ?? 0) - 16,
  );
  await expect(menu).toBeHidden();
  await expect(newButton).toHaveAttribute("aria-expanded", "false");

  await newButton.click();
  await expect(menu).toBeVisible();
  const option = menu
    .locator('[data-lifecycle-contract="object-type-option-row"]')
    .filter({ hasText: "Página" })
    .first();
  await expect(option).toHaveAttribute("role", "option");
  await expectStableBoxOnHover(option);
  await option.focus();
  await expect(option).toBeFocused();
  expect(
    await option.evaluate((element) => element.matches(":focus-visible")),
  ).toBe(true);
  await option.hover();
  await expect(option).toHaveAttribute("data-active", "true");
  await expect(option).toHaveAttribute("aria-selected", "true");
  await page.mouse.down();
  expect(await option.evaluate((element) => element.matches(":active"))).toBe(
    true,
  );
  await page.mouse.up();

  await expect(createdObjectWorkspace(page)).toBeVisible();
  await expect(
    page.locator('[data-lifecycle-contract="object-tab"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('[data-lifecycle-contract="object-editor-shell"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('[data-lifecycle-contract="editable-object-title"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('[data-lifecycle-contract="editable-object-body"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('[data-tab-id^="created-page-"] [role="tab"]').first(),
  ).toHaveAttribute("aria-selected", "true");
  const lifecyclePageTitle = "Lifecycle page card";
  await writeCreatedObjectTitle(page, lifecyclePageTitle);
  const pageCountRow = page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .first();
  const pageCountBadge = pageCountRow
    .locator("span")
    .filter({ hasText: /^1$/ })
    .first();
  await expect(pageCountBadge).toHaveText("1");
  await expect(pageCountBadge).toHaveCSS("opacity", "0");
  await expectStableBoxOnHover(pageCountRow);
  await expect(pageCountBadge).toHaveCSS("opacity", "0.8");

  await page.getByRole("button", { name: "Novo", exact: true }).click();
  await page.locator('[role="option"]').filter({ hasText: "Tarefa" }).click();
  await expect(
    page.locator('[data-lifecycle-contract="object-capture-surface"]'),
  ).toBeVisible();
  await page.getByRole("button", { name: "Adicionar tarefa" }).click();
  await expect(
    page.locator('[data-lifecycle-contract="object-validation-message"]'),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(newButton).toBeFocused();

  await selectNewObject(page, "Tarefa");
  await page.getByPlaceholder("Título da tarefa").fill("Lifecycle field task");
  await page.getByRole("button", { name: "Adicionar tarefa" }).click();
  await page.getByRole("button", { name: "Abrir", exact: true }).click();
  const fieldGroup = page
    .locator('[data-lifecycle-contract="object-field-group"]')
    .filter({ visible: true });
  await expect(fieldGroup).toBeVisible();
  const completed = fieldGroup.getByLabel("Concluída");
  await completed.focus();
  await expect(completed).toBeFocused();
  await completed.check();
  await fieldGroup.getByLabel("Data de vencimento").fill("2026-08-26");
  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      const task = entities.find(
        (entity: { objectTypeId: string }) => entity.objectTypeId === "task",
      );
      return task ? [task.completed, task.dueDate] : null;
    })
    .toEqual([true, "2026-08-26"]);

  await selectNewObject(page, "Tabela");
  await expect(
    page.locator('[data-lifecycle-contract="object-field"]').first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Novo", exact: true }).click();
  await page.locator('[role="option"]').filter({ hasText: "Áudio" }).click();
  await page.getByLabel("Escolher arquivo local").setInputFiles({
    buffer: Buffer.from("audio"),
    mimeType: "audio/mpeg",
    name: "contract-audio.mp3",
  });
  await expect
    .poll(() =>
      page
        .locator('[data-lifecycle-contract="object-attachment-control"]')
        .count(),
    )
    .toBeGreaterThan(0);

  await openObjectTypeStudio(page);
  const dialog = page.getByRole("dialog");
  const preset = dialog
    .locator('[data-lifecycle-contract="object-type-preset-card"]')
    .filter({ hasText: "Livro" })
    .first();
  await preset.hover();
  await preset.click();
  await expect(
    dialog
      .locator('[data-lifecycle-contract="object-icon-tone-preview"]')
      .first(),
  ).toBeVisible();
  await expect(
    dialog.locator('[data-lifecycle-contract="object-type-details-panel"]'),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await openObjectTypeStudio(page);
  const customDialog = page.getByRole("dialog");
  await customDialog
    .locator('[data-lifecycle-contract="custom-object-type-form"]')
    .click();
  await expect(
    customDialog.locator('[data-lifecycle-contract="custom-object-type-form"]'),
  ).toHaveAttribute("data-selected", "true");
  await page.mouse.click(4, 4);
  await expect(customDialog).toBeHidden();

  await expectCreatedObjectProjection(
    page,
    "page",
    "Páginas",
    lifecyclePageTitle,
  );
  await page.getByRole("button", { name: "Tabelas", exact: true }).click();
  await expect(createdObjectWorkspace(page)).toBeHidden();
  await page.getByRole("button", { name: "Páginas", exact: true }).click();
  await page.getByRole("button", { name: "Grade", exact: true }).click();
  const projectionCard = page
    .locator('[data-lifecycle-contract="object-projection-card"]')
    .filter({ hasText: lifecyclePageTitle })
    .first();
  await expect(projectionCard).toBeVisible();
  await expectStableBoxOnHover(projectionCard);
  const projectionCardButton = projectionCard
    .getByRole("button", {
      name: `Abrir: ${lifecyclePageTitle}`,
      exact: true,
    })
    .first();
  await projectionCardButton.focus();
  await expect(projectionCardButton).toBeFocused();
  await projectionCardButton.click();
  await expectActiveEditorTitle(page, lifecyclePageTitle);
  await expect(pageCountBadge).toHaveText("1");
  expect(errors).toEqual([]);
});

test("every supported New family persists once and reopens from its tab projection", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const families = [
    {
      id: "ai-chat",
      label: "Chat de IA",
      plural: "Chats de IA",
      kind: "title",
    },
    { id: "page", label: "Página", plural: "Páginas", kind: "title" },
    { id: "table", label: "Tabela", plural: "Tabelas", kind: "table" },
    { id: "task", label: "Tarefa", plural: "Tarefas", kind: "task" },
    { id: "weblink", label: "Weblink", plural: "Weblinks", kind: "url" },
    { id: "tweet", label: "Tweet", plural: "Tweets", kind: "tweet" },
    { id: "tag", label: "Etiqueta", plural: "Etiquetas", kind: "title" },
    { id: "query", label: "Query", plural: "Queries", kind: "query" },
    {
      id: "image",
      label: "Imagem",
      plural: "Imagens",
      kind: "file",
      mime: "image/png",
    },
    {
      id: "pdf",
      label: "PDF",
      plural: "PDFs",
      kind: "file",
      mime: "application/pdf",
    },
    {
      id: "audio",
      label: "Áudio",
      plural: "Áudios",
      kind: "file",
      mime: "audio/mpeg",
    },
    {
      id: "file",
      label: "Arquivo",
      plural: "Arquivos",
      kind: "file",
      mime: "text/plain",
    },
  ] as const;

  for (const family of families) {
    await selectNewObject(page, family.label);
    const title = `Parity ${family.id}`;

    if (family.kind === "task") {
      await page.getByPlaceholder("Título da tarefa").fill(title);
      await page.getByRole("button", { name: "Adicionar tarefa" }).click();
      await page.getByRole("button", { name: "Abrir", exact: true }).focus();
      await page.keyboard.press("Enter");
    } else if (family.kind === "url" || family.kind === "tweet") {
      await page
        .getByPlaceholder("Cole a URL")
        .fill(
          family.kind === "tweet"
            ? "https://x.com/openai/status/123456789"
            : "https://example.com/parity",
        );
      await page
        .getByRole("button", { name: "Adicionar", exact: true })
        .click();
    } else if (family.kind === "file") {
      await page.getByLabel("Escolher arquivo local").setInputFiles({
        buffer:
          family.id === "image"
            ? tinyPng
            : Buffer.from(family.id === "pdf" ? "%PDF-1.4" : "parity"),
        mimeType: family.mime,
        name: `parity-${family.id}.${family.id === "image" ? "png" : family.id === "audio" ? "mp3" : family.id === "pdf" ? "pdf" : "txt"}`,
      });
    }

    const workspace = createdObjectWorkspace(page);
    await expect(workspace).toBeVisible();
    const objectTypeId =
      (await workspace.getAttribute("data-object-type")) ?? family.id;

    if (family.kind === "query") {
      await workspace
        .getByLabel("Descrição da Query")
        .fill("páginas criadas hoje");
      await workspace.getByRole("button", { name: "Gerar" }).click();
      await expectActiveEditorTitle(page, "páginas criadas hoje");
      await expect(workspace).toContainText("1 resultado");
      await expect(workspace).toContainText("Parity page");
      await expect
        .poll(async () => {
          const entities = await persistedEntities(page);
          const query = entities.find(
            (candidate: { objectTypeId: string }) =>
              candidate.objectTypeId === "query",
          );
          return query
            ? {
                created: query.filters.created,
                description: query.description,
                objectTypeId: query.filters.objectTypeId,
                title: query.title,
              }
            : null;
        })
        .toEqual({
          created: "today",
          description: "páginas criadas hoje",
          objectTypeId: "page",
          title: "páginas criadas hoje",
        });
    } else if (family.kind === "table") {
      await workspace.getByRole("textbox", { name: "Título" }).fill(title);
      await workspace
        .getByRole("textbox", { name: "Notas" })
        .fill("Parity table notes");
      await workspace.getByLabel("Linha 1, coluna 1").fill("R1C1");
      await workspace.getByLabel("Linha 2, coluna 2").fill("R2C2");
      await workspace.getByLabel("Linha 2, coluna 2").blur();
      await expect
        .poll(async () => {
          const entities = await persistedEntities(page);
          const table = entities.find(
            (candidate: { objectTypeId: string }) =>
              candidate.objectTypeId === objectTypeId,
          );
          return table?.cells
            .filter((cell: { value: string }) => cell.value)
            .map((cell: { column: number; row: number; value: string }) => ({
              column: cell.column,
              row: cell.row,
              value: cell.value,
            }));
        })
        .toEqual([
          { column: 0, row: 0, value: "R1C1" },
          { column: 1, row: 1, value: "R2C2" },
        ]);
    } else if (family.kind === "url" || family.kind === "tweet") {
      await workspace.getByRole("textbox", { name: "Título" }).fill(title);
      await workspace
        .getByRole("textbox", { name: "Notas" })
        .fill("Parity URL notes");
    } else if (family.kind !== "task" && family.kind !== "file") {
      await workspace.getByRole("textbox", { name: "Título" }).fill(title);
      const bodyEditor = workspace.getByRole("textbox", { name: "Text" });
      if ((await bodyEditor.count()) > 0) {
        await bodyEditor.first().fill(`Body for ${title}`);
      }
    } else if (family.kind === "file") {
      await workspace.getByRole("textbox", { name: "Título" }).fill(title);
    }
    if (family.kind !== "task" && family.kind !== "query") {
      await workspace.getByRole("textbox", { name: "Título" }).blur();
      await expect
        .poll(async () => {
          const entities = await persistedEntities(page);
          return (
            entities.find(
              (candidate: { objectTypeId: string }) =>
                candidate.objectTypeId === objectTypeId,
            )?.title ?? ""
          );
        })
        .toBe(title);
    }

    await expect
      .poll(async () => {
        const entities = await persistedEntities(page);
        return entities.filter(
          (entity: { objectTypeId: string }) =>
            entity.objectTypeId === objectTypeId,
        ).length;
      })
      .toBe(1);

    const entities = await persistedEntities(page);
    const entity = entities.find(
      (candidate: { objectTypeId: string }) =>
        candidate.objectTypeId === objectTypeId,
    );
    expect(entity?.id).toBeTruthy();
    await expect(
      page
        .locator('[data-slot="app-sidebar-object-type-row"]')
        .filter({ hasText: family.plural })
        .first(),
    ).toContainText("1");
    await expect(
      page
        .locator(`[data-tab-id="${entity.id}"] [role="tab"]`)
        .filter({ visible: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page
      .locator('[aria-label="Workspace tabs"] [role="tab"]')
      .first()
      .click();
    await page.getByRole("button", { name: "Lista de abas" }).click();
    await page
      .locator('[data-slot="app-header-tab-list"]')
      .getByRole("button", { name: entity.title || "Sem título", exact: true })
      .click();
    await expect(workspace).toBeVisible();
    if (family.kind === "query") {
      await expectActiveEditorTitle(page, "páginas criadas hoje");
      await expect(createdObjectWorkspace(page)).toContainText("1 resultado");
      await expect(createdObjectWorkspace(page)).toContainText("Parity page");
    } else if (family.kind === "table") {
      await expectActiveEditorTitle(page, title);
      await expect(
        createdObjectWorkspace(page).getByLabel("Linha 1, coluna 1"),
      ).toHaveValue("R1C1");
      await expect(
        createdObjectWorkspace(page).getByLabel("Linha 2, coluna 2"),
      ).toHaveValue("R2C2");
    } else {
      await expectActiveEditorTitle(page, entity.title || "Sem título");
    }
  }

  expect(errors).toEqual([]);
});

test("preset and custom object families persist once and reopen from projections", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const presetFamilies = [
    {
      id: "book",
      presetLabel: "Livro",
      singularName: "Book",
      pluralName: "Books",
    },
    {
      id: "person",
      presetLabel: "Pessoa",
      singularName: "Person",
      pluralName: "People",
    },
    {
      id: "area",
      presetLabel: "Área",
      singularName: "Area",
      pluralName: "Areas",
    },
    {
      id: "meeting",
      presetLabel: "Reunião",
      singularName: "Meeting",
      pluralName: "Meetings",
    },
    {
      id: "definition",
      presetLabel: "Definição",
      singularName: "Definition",
      pluralName: "Definitions",
    },
    {
      id: "idea",
      presetLabel: "Ideia",
      singularName: "Idea",
      pluralName: "Ideas",
    },
    {
      id: "place",
      presetLabel: "Lugar",
      singularName: "Place",
      pluralName: "Places",
    },
    {
      id: "project",
      presetLabel: "Projeto",
      singularName: "Project",
      pluralName: "Projects",
    },
    {
      id: "organization",
      presetLabel: "Organização",
      singularName: "Organization",
      pluralName: "Organizations",
    },
    {
      id: "media",
      presetLabel: "Mídia",
      singularName: "Media",
      pluralName: "Media",
    },
    {
      id: "travel",
      presetLabel: "Viagem",
      singularName: "Travel",
      pluralName: "Travel",
    },
    {
      id: "quote",
      presetLabel: "Citação",
      singularName: "Quote",
      pluralName: "Quotes",
    },
    {
      id: "atomic-note",
      presetLabel: "Nota atômica",
      singularName: "Atomic note",
      pluralName: "Atomic notes",
    },
  ] as const;

  for (const family of presetFamilies) {
    await createStructureFromPreset(page, family.presetLabel);
    const title = `Preset ${family.id}`;
    await selectNewObject(page, family.singularName);
    await writeCreatedObjectTitle(page, title);

    const snapshot = await persistedSnapshot(page);
    const structure = snapshot.structures.find(
      (candidate: {
        ownership: string;
        pluralName: string;
        singularName: string;
      }) =>
        candidate.ownership === "custom" &&
        candidate.singularName === family.singularName &&
        candidate.pluralName === family.pluralName,
    );
    expect(structure?.id).toBeTruthy();
    expect(
      snapshot.entities.filter(
        (entity: { objectTypeId: string }) =>
          entity.objectTypeId === structure.id,
      ),
    ).toHaveLength(1);

    await expectCreatedObjectProjection(
      page,
      structure.id,
      family.pluralName,
      title,
    );
  }

  await createCustomStructure(page, "Default", "Default");
  await selectNewObject(page, "Default");
  await writeCreatedObjectTitle(page, "Custom Default object");
  const snapshot = await persistedSnapshot(page);
  const custom = snapshot.structures.find(
    (candidate: { ownership: string; singularName: string }) =>
      candidate.ownership === "custom" && candidate.singularName === "Default",
  );
  expect(custom?.id).toBeTruthy();
  expect(
    snapshot.entities.filter(
      (entity: { objectTypeId: string }) => entity.objectTypeId === custom.id,
    ),
  ).toHaveLength(1);
  await expectCreatedObjectProjection(
    page,
    custom.id,
    "Default",
    "Custom Default object",
  );
  expect(errors).toEqual([]);
});
