import { expect, type Locator, type Page, test } from "@playwright/test";

const desktopViewports = [
  { width: 1536, height: 912 },
  { width: 1280, height: 800 },
  { width: 1153, height: 912 },
  { width: 1024, height: 768 },
  { width: 768, height: 720 },
] as const;
const recordedSidebarWidths = {
  // The August 26 matched reference measured a persisted 288px sidebar at
  // 1153x912. Its separate clean-local capture was 224px; do not conflate it
  // with the current production default exercised by these browser tests.
  referencePersisted: 288,
  historicalCleanLocal: 224,
} as const;
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
  await page.addInitScript(() => {
    const clearKey = "notes-app:e2e-cleared";
    if (window.sessionStorage.getItem(clearKey) === "true") return;
    window.localStorage.clear();
    window.sessionStorage.setItem(clearKey, "true");
  });
  await page.goto("/pt-BR");
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.waitForTimeout(750);
  return errors;
}

function objectTypeWorkspace(page: Page) {
  return page
    .locator('[data-slot="workspace-object-type-view"]')
    .filter({
      visible: true,
    });
}

function createdObjectWorkspace(page: Page) {
  return page
    .locator('[data-slot="workspace-object-page-view"]')
    .filter({
      visible: true,
    });
}

async function createPageObject(page: Page) {
  await page
    .locator('[data-testid="app-shell-sidebar"]')
    .getByRole("button", { name: "Novo", exact: true })
    .click();
  await page.locator('[role="option"]').filter({ hasText: "Página" }).click();
  const workspace = createdObjectWorkspace(page);
  await expect(workspace).toBeVisible();
  return (await workspace.getAttribute("data-object-type")) ?? "page";
}

async function selectNewObject(page: Page, label: string) {
  await page
    .locator('[data-testid="app-shell-sidebar"]')
    .getByRole("button", { name: "Novo", exact: true })
    .click();
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

async function expectContainedUsableSurface(
  page: Page,
  surface: Locator,
  viewport: { width: number; height: number },
) {
  await expect
    .poll(async () => {
      const box = await surface.boundingBox();
      return Boolean(
        box &&
          box.width > 0 &&
          box.height > 0 &&
          box.x >= 0 &&
          box.y >= 0 &&
          box.x + box.width <= viewport.width &&
          box.y + box.height <= viewport.height,
      );
    })
    .toBe(true);

  const box = await surface.boundingBox();
  expect(box).toBeTruthy();
  expect(box?.width ?? 0).toBeGreaterThan(0);
  expect(box?.height ?? 0).toBeGreaterThan(0);
  expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
  expect(box?.y ?? -1).toBeGreaterThanOrEqual(0);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(viewport.width);
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(
    viewport.height,
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth ===
          document.documentElement.clientWidth,
      ),
    )
    .toBe(true);
}

async function openObjectTypeStudio(page: Page) {
  const trigger = page.locator(
    '[data-slot="app-sidebar-object-type-studio"] [data-slot="app-sidebar-section-action"]',
  );
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

async function expectObjectTypeCardLabels(
  cards: Locator,
  labels: readonly string[],
) {
  await expect(cards).toHaveCount(labels.length);
  await expect
    .poll(async () =>
      Promise.all(
        labels.map(async (_label, index) =>
          (await cards.nth(index).textContent())?.trim(),
        ),
      ),
    )
    .toEqual(labels);
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
    .getByRole("button", { name: "Criar tipo de objeto", exact: true })
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
    .getByRole("button", { name: "Criar tipo de objeto", exact: true })
    .click();
  await expect(dialog).toBeHidden();
}

async function writeCreatedObjectTitle(page: Page, title: string) {
  const workspace = createdObjectWorkspace(page);
  await expect(workspace).toBeVisible();
  await workspace.getByRole("textbox", { name: "Título" }).fill(title);
  await workspace.getByRole("textbox", { name: "Título" }).blur();
}

async function createPageCollection(page: Page, name: string) {
  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .getByRole("button")
    .filter({ hasText: "Páginas" })
    .click();
  const workspace = objectTypeWorkspace(page).first();
  await workspace.getByRole("tab", { name: "Tudo", exact: true }).click();
  await workspace
    .getByRole("button", { name: "Mais opções", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Nova coleção" }).click();
  const collectionScreen = page
    .locator(
      '[data-slot="object-type-named-item-workspace"][data-kind="collection"]',
    )
    .filter({ visible: true });
  await expect(collectionScreen).toBeVisible();
  const collectionInput = collectionScreen.getByRole("textbox", {
    name: "Título",
    exact: true,
  });
  await collectionInput.fill(name);
  await collectionInput.blur();
  return name;
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
        `[data-slot="workspace-object-page-view"][data-object-type="${objectTypeId}"]`,
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

async function installMainTabFlashObserver(page: Page, targetLabel: string) {
  await page.addInitScript((label) => {
    const seedLabels = new Set(["Atomic notes", "Quotes", "Pages"]);
    const global = window as typeof window & {
      __workspaceTabFlash?: string[][];
    };
    global.__workspaceTabFlash = [];

    function inspectTabs() {
      const tabList = document.querySelector('[aria-label="Workspace tabs"]');
      if (!tabList) return;
      const labels = Array.from(tabList.querySelectorAll('[role="tab"]'))
        .map((tab) => tab.textContent?.trim() ?? "")
        .filter(Boolean);
      const showsSeedTabs = labels.some((item) => seedLabels.has(item));
      const showsTargetTab = labels.includes(label);
      if (showsSeedTabs && !showsTargetTab) {
        global.__workspaceTabFlash?.push(labels);
      }
    }

    function startObserver() {
      const root = document.documentElement;
      if (!root) {
        requestAnimationFrame(startObserver);
        return;
      }
      const observer = new MutationObserver(inspectTabs);
      observer.observe(root, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      requestAnimationFrame(inspectTabs);
    }

    startObserver();
  }, targetLabel);
}

for (const viewport of desktopViewports) {
  test(`desktop geometry ${viewport.width}px keeps the recorded shell state contained`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const errors = await openWorkspace(page);
    const sidebar = page.locator("#app-shell-sidebar");
    const main = page.locator("#app-shell-main");
    const mainHeader = page
      .locator('[data-slot="app-shell-header"]')
      .filter({ visible: true })
      .first();
    const mainSurface = page
      .locator('[data-slot="app-shell-surface-wrapper"][data-side="main"]')
      .filter({ visible: true })
      .locator('[data-slot="app-shell-surface"]')
      .first();

    await expect(sidebar).toBeVisible();
    await expect
      .poll(async () => (await sidebar.boundingBox())?.width)
      .toBeCloseTo(recordedSidebarWidths.referencePersisted, 0);
    await expect
      .poll(async () => (await mainHeader.boundingBox())?.height)
      .toBeCloseTo(46, 0);
    await expect
      .poll(async () => (await main.boundingBox())?.width ?? 0)
      .toBeGreaterThan(0);
    const surfaceBox = await mainSurface.boundingBox();
    const sidebarBox = await sidebar.boundingBox();
    expect(surfaceBox?.x ?? 0).toBeCloseTo(
      (sidebarBox?.x ?? 0) + (sidebarBox?.width ?? 0) + 10,
      0,
    );
    await expect(mainSurface).toHaveCSS("border-radius", "12px");
    await expectContainedUsableSurface(page, mainSurface, viewport);
    expect(errors).toEqual([]);
  });
}

test("1153px records the persisted-reference width separately from the historical clean-local baseline", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1153, height: 912 });
  const errors = await openWorkspace(page);
  const sidebar = page.locator("#app-shell-sidebar");

  // The current shell intentionally defaults to the reference width. Keep the
  // older 224px clean-local observation visible as a baseline, not an expected
  // current-reference geometry value.
  expect(recordedSidebarWidths.historicalCleanLocal).toBe(224);
  expect(recordedSidebarWidths.referencePersisted).toBe(288);
  await expect(sidebar).toBeVisible();
  await expect
    .poll(async () => (await sidebar.boundingBox())?.width)
    .toBeCloseTo(recordedSidebarWidths.referencePersisted, 0);
  expect(errors).toEqual([]);
});

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

  await target.click({
    position: {
      x: (targetBox?.width ?? 0) / 2,
      y: (targetBox?.height ?? 0) / 2,
    },
  });
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

test("object type studio matches Capacities suggested and basic type layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1329, height: 912 });
  const errors = await openWorkspace(page);

  await openObjectTypeStudio(page);
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAccessibleName("Adicione novo tipo de objeto");
  await expect(
    dialog.getByText("Preciso de um novo tipo de objeto?", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText(
      "Nem sempre. Um novo tipo é mais útil quando você tem um tipo distinto de nota que precisa de seus próprios detalhes",
    ),
  ).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Saiba mais" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Livro" })).toBeFocused();

  await expectObjectTypeCardLabels(
    dialog.locator(
      '[data-slot="app-sidebar-object-type-card"][data-card-family="suggested"]',
    ),
    [
      "Livro",
      "Pessoa",
      "Área",
      "Reunião",
      "Citação",
      "Definição",
      "Ideia",
      "Lugar",
      "Projeto",
      "Organização",
      "Nota atômica",
      "Mídia",
      "Viagem",
      "Crie o seu próprio",
    ],
  );
  await expect(
    dialog.getByText("Tipos básicos", { exact: true }),
  ).toBeVisible();
  await expectObjectTypeCardLabels(
    dialog.locator(
      '[data-slot="app-sidebar-object-type-card"][data-card-family="basic"]',
    ),
    [
      "Página",
      "Etiqueta",
      "Imagem",
      "Weblink",
      "PDF",
      "Áudio",
      "Arquivo",
      "Tweet",
      "Chat de IA",
      "Tabela",
      "Tarefa",
      "Query",
    ],
  );

  await dialog.getByRole("button", { name: "Livro" }).click();
  const details = dialog.locator(
    '[data-slot="app-sidebar-object-type-details"]',
  );
  await expect(details).toBeVisible();
  await expect(
    details.getByText(
      "Aprenda com os livros que você lê e conecte-os ao conhecimento existente.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    details.getByText("Propriedades", { exact: true }),
  ).toBeVisible();
  for (const property of [
    "Título",
    "Descrição",
    "Etiquetas",
    "Notas",
    "Imagem de capa",
    "Autor",
    "Avaliação",
    "Recomendado por",
    "Meio",
  ]) {
    await expect(details.getByText(property, { exact: true })).toBeVisible();
  }
  await expect(
    details.getByRole("button", { name: "Criar tipo de objeto" }),
  ).toBeVisible();

  for (const objectType of ["Reunião", "Citação", "Projeto", "Organização"]) {
    await dialog.getByRole("button", { name: objectType }).click();
    await expect(
      details.getByText(objectType, { exact: true }).first(),
    ).toBeVisible();
  }

  await dialog.getByRole("button", { name: "Crie o seu próprio" }).click();
  await expect(
    details.getByRole("textbox", { name: "Nome", exact: true }),
  ).toBeVisible();
  await expect(
    details.getByRole("textbox", { name: "Plural do nome" }),
  ).toBeVisible();

  await dialog.getByRole("button", { name: "Página" }).click();
  await expect(details).toBeVisible();
  await expect(
    details.getByText("Página", { exact: true }).first(),
  ).toBeVisible();

  expect(errors).toEqual([]);
});

test("graph controls preserve hover geometry and support reversible click and drag states", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1294, height: 912 });
  const errors = await openWorkspace(page);

  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Graph first");
  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Graph second");

  await page
    .getByRole("button", { name: "Abrir menu do painel lateral" })
    .click();
  await page.getByRole("menuitem", { name: "Visualização em grafo" }).click();

  const graph = page.locator('[data-slot="workspace-graph"]');
  const canvas = graph.locator('[data-slot="workspace-graph-canvas"]');
  await expect(canvas).toBeVisible();

  const sidePanelBox = await page
    .locator('[data-slot="app-shell-side-panel"]')
    .boundingBox();
  expect(sidePanelBox?.width).toBeGreaterThanOrEqual(373.5);
  expect(sidePanelBox?.width).toBeLessThanOrEqual(375);

  const controlNames = [
    "Mostrar menos",
    "Mostrar mais",
    "Configurações do grafo",
    "Centralizar grafo",
    "Diminuir zoom",
    "Aumentar zoom",
  ] as const;
  for (const name of controlNames) {
    const control = graph.getByRole("button", { name });
    const idleBackground = await control.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    await expectStableBoxOnHover(control);
    expect(
      await control.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    ).not.toBe(idleBackground);
  }

  const expandedNodeCount = await canvas.locator(":scope > div").count();
  await graph.getByRole("button", { name: "Mostrar menos" }).click();
  await expect(canvas.locator(":scope > div")).toHaveCount(1);
  await graph.getByRole("button", { name: "Mostrar mais" }).click();
  await expect(canvas.locator(":scope > div")).toHaveCount(expandedNodeCount);

  await graph.getByRole("button", { name: "Configurações do grafo" }).click();
  const settings = page.getByRole("dialog");
  await page.waitForTimeout(150);
  const settingsBox = await settings.boundingBox();
  expect(settingsBox?.width).toBeGreaterThanOrEqual(287);
  expect(settingsBox?.width).toBeLessThanOrEqual(289);
  await expect(settings.getByRole("checkbox")).toHaveCount(4);
  for (const checkbox of await settings.getByRole("checkbox").all()) {
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  }
  await page.keyboard.press("Escape");
  await expect(settings).toBeHidden();

  await graph.getByRole("button", { name: "Diminuir zoom" }).click();
  await expect(canvas).toHaveCSS(
    "transform",
    /matrix\(0\.66666[0-9]*, 0, 0, 0\.66666[0-9]*, 0, 0\)/,
  );
  await graph.getByRole("button", { name: "Aumentar zoom" }).click();

  const canvasBox = await canvas.boundingBox();
  expect(canvasBox).toBeTruthy();
  if (!canvasBox) return;
  const startX = canvasBox.x + canvasBox.width / 2;
  const startY = canvasBox.y + canvasBox.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 42, startY + 28, { steps: 4 });
  await page.mouse.up();
  await expect(canvas).toHaveAttribute(
    "style",
    /translate\(42px, 28px\) scale\(1\)/,
  );

  await graph.getByRole("button", { name: "Centralizar grafo" }).click();
  await expect(canvas).toHaveAttribute(
    "style",
    /translate\(0px, 0px\) scale\(1\)/,
  );
  expect(errors).toEqual([]);
});

test("contextual panel entries and Explore actions dispatch route-specific bodies", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1294, height: 912 });
  const errors = await openWorkspace(page);

  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Context target");
  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Context source");

  const sourceWorkspace = createdObjectWorkspace(page);
  await sourceWorkspace
    .locator('[data-slot="workspace-link-picker"]')
    .getByRole("button", { name: /^Vincular / })
    .first()
    .click();
  await sourceWorkspace
    .getByRole("button", { name: "Incorporar", exact: true })
    .click();

  async function openContextEntry(name: string) {
    await page
      .getByRole("button", { name: "Abrir menu do painel lateral" })
      .click();
    await page.getByRole("menuitem", { name, exact: true }).click();
  }

  await openContextEntry("Objetos internos");
  const sidePanel = page.locator('[data-slot="app-shell-side-panel"]');
  await expect(
    sidePanel.locator(
      '[data-slot="contextual-panel-body"][data-contextual-entry="objectsInside"]',
    ),
  ).toBeVisible();
  await expect(sidePanel).toContainText("Context target");

  await openContextEntry("Conteúdo relacionado");
  await expect(
    sidePanel.locator(
      '[data-slot="contextual-panel-body"][data-contextual-entry="relatedContent"]',
    ),
  ).toBeVisible();
  await expect(sidePanel).toContainText("Context target");

  await page.getByRole("tab", { name: "Context target" }).click();
  await openContextEntry("Links de entrada");
  await expect(
    sidePanel.locator(
      '[data-slot="contextual-panel-body"][data-contextual-entry="backlinks"]',
    ),
  ).toBeVisible();
  await expect(sidePanel).toContainText("Context source");

  await page.getByRole("button", { name: "Explorar", exact: true }).click();
  await sidePanel.getByRole("button", { name: "Chat de IA" }).click();
  await expect(
    sidePanel.locator(
      '[data-slot="contextual-panel-body"][data-contextual-entry="aiAssistantChat"]',
    ),
  ).toBeVisible();
  await expect(sidePanel).toContainText(
    "O preenchimento por IA ainda não está disponível localmente.",
  );

  await openContextEntry("Buscar");
  await expect(
    sidePanel.locator(
      '[data-slot="contextual-panel-body"][data-contextual-entry="localSpaceQuery"]',
    ),
  ).toBeVisible();
  await sidePanel
    .getByRole("textbox", { name: "Buscar conteúdo local" })
    .fill("Context source");
  await expect(
    sidePanel.getByRole("button", { name: "Abrir Context source" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Nova aba lateral", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Nova aba lateral", exact: true })
    .click();
  const overlay = page.locator('[data-slot="side-panel-search-overlay"]');
  await expect(overlay).toBeVisible();
  await overlay
    .getByRole("button")
    .filter({ hasText: "Context target" })
    .first()
    .click();
  await expect(
    sidePanel.locator(
      '[data-slot="created-object-workspace"][data-object-type="page"]',
    ),
  ).toBeVisible();
  await expect(sidePanel).toContainText("Context target");

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Tabelas" })
    .getByRole("button")
    .filter({ hasText: "Tabelas" })
    .click();
  await openContextEntry("Visualização em grafo");
  const graph = sidePanel.locator('[data-slot="workspace-graph"]');
  await expect(graph).toBeVisible();
  await expect(
    graph.locator('[data-slot="workspace-graph-canvas"]'),
  ).toHaveAttribute("data-graph-empty", "true");
  await expect(
    graph.locator('[data-slot="workspace-graph-empty-state"]'),
  ).toContainText("Selecione um objeto");
  for (const name of [
    "Mostrar menos",
    "Mostrar mais",
    "Configurações do grafo",
    "Centralizar grafo",
    "Diminuir zoom",
    "Aumentar zoom",
  ]) {
    await expect(graph.getByRole("button", { name })).toBeVisible();
  }

  await page.setViewportSize({ width: 480, height: 844 });
  await page.getByRole("button", { name: "Abrir painel lateral" }).click();
  const mobilePanel = page.locator('[data-slot="app-shell-side-panel"]');
  await expect(
    mobilePanel.locator('[data-slot="workspace-graph"]'),
  ).toBeVisible();

  for (const [name, entry] of [
    ["Links de entrada", "backlinks"],
    ["Objetos internos", "objectsInside"],
    ["Conteúdo relacionado", "relatedContent"],
    ["Chat de IA", "aiAssistantChat"],
    ["Buscar", "localSpaceQuery"],
    ["Visualização em grafo", "graphView"],
  ] as const) {
    await mobilePanel
      .getByRole("button", { name: "Abrir menu do painel lateral" })
      .click();
    await page.getByRole("menuitem", { name, exact: true }).click();
    await expect(
      mobilePanel.locator(
        `[data-slot="contextual-panel-body"][data-contextual-entry="${entry}"]`,
      ),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("Page Customize exposes every reference action and persists property outcomes", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1294, height: 912 });
  const errors = await openWorkspace(page);
  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Customizable page");

  const main = page.locator('main[data-slot="app-shell-main"]');
  const header = main.locator('[data-slot="workspace-object-page-header"]');
  const customize = main.getByRole("button", { name: "Personalizar" });
  const actionNames = [
    "Gerar Título",
    "Adicionar Descrição",
    "Preencher Descrição",
    "Adicionar Aliases",
    "Preencher Aliases",
    "Adicionar Imagem de Capa",
    "Preencher Todas as Propriedades",
    "Layout Amplo",
  ] as const;

  async function openCustomize() {
    await header.hover();
    await customize.click();
    const menu = page.getByRole("menu", { name: "Personalizar" });
    await expect(menu.getByRole("menuitem")).toHaveCount(actionNames.length);
    return menu;
  }

  let menu = await openCustomize();
  await page.waitForTimeout(150);
  const menuBox = await menu.boundingBox();
  expect(menuBox?.width).toBeGreaterThanOrEqual(276);
  expect(menuBox?.width).toBeLessThanOrEqual(278);
  for (const name of actionNames) {
    await expect(menu.getByRole("menuitem", { name })).toBeVisible();
  }
  await page.keyboard.press("Escape");

  for (const name of actionNames.filter(
    (name) => name !== "Adicionar Imagem de Capa",
  )) {
    menu = await openCustomize();
    await menu.getByRole("menuitem", { name }).click();
  }

  const fileChooserPromise = page.waitForEvent("filechooser");
  menu = await openCustomize();
  await menu
    .getByRole("menuitem", { name: "Adicionar Imagem de Capa" })
    .click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles([]);

  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      return entities.find(
        (candidate: { title: string }) =>
          candidate.title === "Customizable page",
      );
    })
    .toMatchObject({
      aliases: ["Customizable page"],
      description: "Customizable page",
    });

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  expect(
    (await persistedEntities(page)).find(
      (candidate: { title: string }) => candidate.title === "Customizable page",
    ),
  ).toMatchObject({
    aliases: ["Customizable page"],
    description: "Customizable page",
  });
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

test("direct object routes do not flash seed main tabs before route selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const clearKey = "notes-app:e2e-route-flash-cleared";
    if (window.sessionStorage.getItem(clearKey) === "true") return;
    window.localStorage.clear();
    window.sessionStorage.setItem(clearKey, "true");
  });

  await page.goto("/en");
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.locator("#workspace-new-trigger").click();
  await page.locator('[role="option"]').filter({ hasText: "Page" }).click();
  const title = "Deep Linked Page";
  await createdObjectWorkspace(page)
    .getByRole("textbox", { name: "Title" })
    .fill(title);
  await createdObjectWorkspace(page)
    .getByRole("textbox", { name: "Title" })
    .blur();
  await expect
    .poll(() =>
      page.evaluate(() => window.location.pathname.split("/").filter(Boolean)),
    )
    .toHaveLength(3);
  const directUrl = page.url();

  await installMainTabFlashObserver(page, title);
  await page.goto(directUrl);
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await expect(
    page
      .locator('[aria-label="Workspace tabs"] [role="tab"]')
      .filter({ hasText: title }),
  ).toBeVisible();
  const flashes = await page.evaluate(
    () =>
      (window as typeof window & { __workspaceTabFlash?: string[][] })
        .__workspaceTabFlash ?? [],
  );
  expect(flashes).toEqual([]);
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

test("object page header controls keep fluid click and keyboard states", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Header control page");
  await page.mouse.move(1100, 700);
  await expect(
    page.locator('[data-slot="hover-card-portal"] [data-open]'),
  ).toHaveCount(0);

  const workspace = createdObjectWorkspace(page);
  const header = workspace.locator(
    '[data-slot="workspace-object-page-header"]',
  );
  const customize = header.getByRole("button", {
    name: "Personalizar",
    exact: true,
  });
  const collections = header.getByRole("textbox", {
    name: "Coleções",
    exact: true,
  });
  const tags = workspace.getByRole("textbox", {
    name: "Etiquetas",
    exact: true,
  });

  await expectStableBoxOnHover(collections);
  await collections.click();
  const collectionPopover = page.locator(
    '[data-slot="popover-content"][data-open]',
  );
  await expect(collectionPopover).toBeVisible();
  await expect
    .poll(async () => (await collectionPopover.boundingBox())?.width ?? 0)
    .toBeCloseTo(257, 0);
  await expect(
    collectionPopover.getByText("Nenhuma coleção encontrada", { exact: true }),
  ).toHaveCount(0);
  await expect(collectionPopover.getByRole("textbox")).toHaveCount(0);
  await collections.fill("no matching collection");
  await expect(collections).toHaveValue("no matching collection");
  await expect(collectionPopover.getByRole("button")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(collectionPopover).toBeHidden();
  await expect(collections).toBeFocused();
  await expect(collections).toHaveValue("");

  await expectStableBoxOnHover(tags);
  await tags.click();
  const tagsPopover = page.locator('[data-slot="popover-content"][data-open]');
  await expect(tagsPopover).toBeVisible();
  await expect(
    tagsPopover.getByText("Novo Etiqueta", { exact: true }),
  ).toBeVisible();
  await expect(
    tagsPopover.getByText("Procurar todos(as) Etiquetas", { exact: true }),
  ).toBeVisible();
  await expect(tagsPopover.getByRole("textbox")).toHaveCount(0);
  await tags.fill("no matching tag");
  await expect(tags).toHaveValue("no matching tag");
  await expect(
    tagsPopover.getByText("Novo Etiqueta", { exact: true }),
  ).toHaveCount(0);
  await expect(
    tagsPopover.getByText("Novo ‘no matching tag’", { exact: true }),
  ).toHaveCount(0);
  await expect(
    tagsPopover.getByText("Procurar todos(as) Etiquetas", { exact: true }),
  ).toBeVisible();
  const routeBeforeTagPicker = page.url();
  await tagsPopover
    .getByRole("button", {
      name: "Procurar todos(as) Etiquetas",
      exact: true,
    })
    .click();
  const tagPicker = page.locator('[data-slot="object-page-tag-picker"]');
  await expect(tagPicker).toBeVisible();
  await expect(tagPicker.getByRole("textbox", { name: "Buscar" })).toHaveValue(
    "no matching tag",
  );
  await expect(page).toHaveURL(routeBeforeTagPicker);
  await page.keyboard.press("Escape");
  await expect(tagPicker).toBeHidden();
  await expect(tagsPopover).toBeHidden();

  await header.hover();
  await customize.focus();
  await expect(customize).toBeFocused();
  await page.keyboard.press("Enter");
  let menu = page.getByRole("menu", { name: "Personalizar" });
  await expect(menu).toBeVisible();
  await menu
    .getByRole("menuitem", { name: "Layout Amplo" })
    .click({ noWaitAfter: true });
  await expect(
    workspace.locator('[data-slot="workspace-object-page-column"]'),
  ).toHaveAttribute("data-wide-layout", "true");
  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await expect(
    createdObjectWorkspace(page).locator(
      '[data-slot="workspace-object-page-column"]',
    ),
  ).toHaveAttribute("data-wide-layout", "true");

  const reloadedHeader = createdObjectWorkspace(page).locator(
    '[data-slot="workspace-object-page-header"]',
  );
  const reloadedMore = reloadedHeader.getByRole("button", {
    name: "Mais opções",
    exact: true,
  });
  await reloadedMore.click();
  menu = page.locator('[data-slot="dropdown-menu-content"][data-open]');
  await expect(menu).toBeVisible();
  await menu.getByText("Personalizar", { exact: true }).hover();
  await menu
    .getByRole("menuitem", { name: "Layout Amplo" })
    .click({ noWaitAfter: true });
  await expect(
    createdObjectWorkspace(page).locator(
      '[data-slot="workspace-object-page-column"]',
    ),
  ).not.toHaveAttribute("data-wide-layout", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(reloadedMore).toBeFocused();

  const reloadedDisclosure = reloadedHeader.getByRole("button", {
    name: "Alterar tipo de objeto",
    exact: true,
  });
  await reloadedDisclosure.click();
  await expect(
    page.getByRole("textbox", { name: "Buscar", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(reloadedDisclosure).toBeFocused();
  expect(errors).toEqual([]);
});

test("Page Customize respects reduced motion and keeps truthful keyboard controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);

  const header = createdObjectWorkspace(page).locator(
    '[data-slot="workspace-object-page-header"]',
  );
  const customize = header.getByRole("button", {
    name: "Personalizar",
    exact: true,
  });
  const more = header.getByRole("button", {
    name: "Mais opções",
    exact: true,
  });

  await expect(customize).toHaveCount(1);
  await expect(more).toHaveCount(1);
  await expect(customize).not.toHaveAccessibleName("Mais opções");
  await expect
    .poll(() =>
      customize.evaluate(
        (element) => getComputedStyle(element).transitionProperty,
      ),
    )
    .toBe("none");

  await customize.focus();
  await expect(customize).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menu", { name: "Personalizar" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(customize).toBeFocused();
  expect(errors).toEqual([]);
});

test("Page collections synchronize header chips, object-type collection rows, and reload persistence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Collection membership page");
  await createPageCollection(page, "Research collection");
  await page.getByRole("tab", { name: "Collection membership page" }).click();

  const collections = createdObjectWorkspace(page).getByRole("textbox", {
    name: "Coleções",
    exact: true,
  });
  await collections.focus();
  const popover = page.locator('[data-slot="popover-content"][data-open]');
  await expect(popover).toBeVisible();
  await popover.getByRole("button", { name: "Research collection" }).click();
  await expect(
    createdObjectWorkspace(page).getByRole("button", {
      name: "Remover Research collection",
    }),
  ).toBeVisible();
  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      return entities.find(
        (candidate: { title: string }) =>
          candidate.title === "Collection membership page",
      )?.collections;
    })
    .toHaveLength(1);

  await page
    .locator('[data-slot="app-sidebar-collection-row"]')
    .filter({ hasText: "Research collection" })
    .getByRole("button", { name: "Research collection", exact: true })
    .click({ noWaitAfter: true });
  await expect(objectTypeWorkspace(page)).toContainText(
    "Collection membership page",
  );

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  await page.getByRole("tab", { name: "Collection membership page" }).click();
  await expect(
    createdObjectWorkspace(page).getByRole("button", {
      name: "Remover Research collection",
    }),
  ).toBeVisible();

  await createdObjectWorkspace(page)
    .getByRole("button", { name: "Remover Research collection" })
    .click();
  await expect(
    createdObjectWorkspace(page).getByRole("button", {
      name: "Remover Research collection",
    }),
  ).toHaveCount(0);
  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      return entities.find(
        (candidate: { title: string }) =>
          candidate.title === "Collection membership page",
      )?.collections;
    })
    .toEqual([]);
  expect(errors).toEqual([]);
});

test("Page Collections and overflow controls keep Page metadata synchronized", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Overflow collections page");
  await createPageCollection(page, "Overflow collection");
  await page.getByRole("tab", { name: "Overflow collections page" }).click();

  const workspace = createdObjectWorkspace(page);
  const header = workspace.locator(
    '[data-slot="workspace-object-page-header"]',
  );
  const collections = header.getByRole("textbox", {
    name: "Coleções",
    exact: true,
  });
  const more = header.getByRole("button", {
    name: "Mais opções",
    exact: true,
  });
  const customize = header.getByRole("button", {
    name: "Personalizar",
    exact: true,
  });
  const pageEntity = (await persistedEntities(page)).find(
    (candidate: { title: string }) =>
      candidate.title === "Overflow collections page",
  );

  await expect(collections).toHaveCount(1);
  await expect(more).toHaveCount(1);
  await expect(collections).not.toHaveAccessibleName("Mais opções");
  await expect(more).not.toHaveAccessibleName("Coleções");

  await collections.click();
  const popover = page.locator('[data-slot="popover-content"][data-open]');
  await expect(popover).toBeVisible();
  expect(
    (await persistedEntities(page)).find(
      (candidate: { id: string }) => candidate.id === pageEntity?.id,
    )?.collections,
  ).toEqual([]);
  await collections.focus();
  await expect(collections).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(popover).toBeHidden();
  await expect(collections).toBeFocused();

  await more.click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  expect(
    (await persistedEntities(page)).find(
      (candidate: { id: string }) => candidate.id === pageEntity?.id,
    )?.collections,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(more).toBeFocused();

  await more.click();
  await menu.getByRole("menuitem", { name: "Editar coleções" }).click();

  await expect(collections).toBeFocused();
  await expect(popover).toBeVisible();
  await popover
    .getByRole("button", { name: "Overflow collection", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    workspace.getByRole("button", { name: "Remover Overflow collection" }),
  ).toBeVisible();
  await expect
    .poll(async () =>
      (await persistedEntities(page)).find(
        (candidate: { id: string }) => candidate.id === pageEntity?.id,
      )?.collections,
    )
    .toHaveLength(1);
  await page
    .locator('[data-slot="app-sidebar-collection-row"]')
    .filter({ hasText: "Overflow collection" })
    .getByRole("button", { name: "Overflow collection", exact: true })
    .click({ noWaitAfter: true });
  await expect(objectTypeWorkspace(page)).toContainText(
    "Overflow collections page",
  );
  await page.getByRole("tab", { name: "Overflow collections page" }).click();

  await customize.click();
  const customizeMenu = page.getByRole("menu", { name: "Personalizar" });
  await expect(customizeMenu).toBeVisible();
  await customizeMenu
    .getByRole("menuitem", { name: "Layout Amplo" })
    .click({ noWaitAfter: true });
  await expect(
    workspace.locator('[data-slot="workspace-object-page-column"]'),
  ).toHaveAttribute("data-wide-layout", "true");

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  const reloadedWorkspace = createdObjectWorkspace(page);
  const reloadedHeader = reloadedWorkspace.locator(
    '[data-slot="workspace-object-page-header"]',
  );
  const reloadedCollections = reloadedHeader.getByRole("textbox", {
    name: "Coleções",
    exact: true,
  });
  await expect(
    reloadedWorkspace.getByRole("button", {
      name: "Remover Overflow collection",
    }),
  ).toBeVisible();
  await expect(
    reloadedWorkspace.locator('[data-slot="workspace-object-page-column"]'),
  ).toHaveAttribute("data-wide-layout", "true");

  await reloadedWorkspace
    .getByRole("button", { name: "Remover Overflow collection" })
    .click();
  await expect(
    reloadedWorkspace.getByRole("button", {
      name: "Remover Overflow collection",
    }),
  ).toHaveCount(0);
  await expect
    .poll(async () =>
      (await persistedEntities(page)).find(
        (candidate: { id: string }) => candidate.id === pageEntity?.id,
      )?.collections,
    )
    .toEqual([]);

  await reloadedCollections.focus();
  await expect(reloadedCollections).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(popover).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(reloadedCollections).toBeFocused();
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
  const workspace = objectTypeWorkspace(page);
  const disclosure = workspace.getByRole("button", {
    name: "Opções de novo objeto",
    exact: true,
  });
  await disclosure.click();

  const menu = page.locator('[data-slot="dropdown-menu-content"][data-open]');
  await expect(menu).toBeVisible();
  expect(await persistedEntities(page)).toHaveLength(0);
  await expect(
    page
      .locator('[data-slot="app-sidebar-object-type-row"]')
      .filter({ hasText: "Tabelas" })
      .first(),
  ).not.toContainText("1");

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(disclosure).toBeFocused();

  await workspace.getByRole("button", { name: "Novo", exact: true }).click();
  await expect.poll(() => persistedEntities(page)).toHaveLength(1);
  await expect(
    page.locator(
      '[aria-label="Workspace tabs"] [role="tab"][aria-selected="true"]',
    ),
  ).toHaveCount(1);
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
  await workspace
    .getByRole("tab", { name: "Visão geral", exact: true })
    .click();
  await expect(
    workspace.locator('[data-slot="object-type-overview"]'),
  ).toBeVisible();
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

test("production object-type Import handles accepted rejected and cancelled selections", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "PDFs" })
    .getByRole("button")
    .filter({ hasText: "PDFs" })
    .click();
  const workspace = objectTypeWorkspace(page);
  await expect(workspace).toBeVisible();
  await expect(workspace).toHaveAttribute("data-structure-id", "pdf");

  const importButton = workspace.getByRole("button", {
    name: "Importar",
    exact: true,
  });
  const importInput = workspace.getByLabel("Importar arquivo(s)", {
    exact: true,
  });
  await expect(importButton).toBeVisible();
  await expect(importInput).toHaveAttribute("accept", "application/pdf,.pdf");

  async function chooseImportFiles(
    files:
      | []
      | {
          buffer: Buffer;
          mimeType: string;
          name: string;
        },
  ) {
    const fileChooserPromise = page.waitForEvent("filechooser");
    await importButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(files);
  }

  await chooseImportFiles([]);
  await expect(page.locator('[data-slot="workspace-message"]')).toHaveText(
    "Importação cancelada.",
  );
  expect(await persistedEntities(page)).toHaveLength(0);

  await chooseImportFiles({
    buffer: Buffer.from("not a pdf"),
    mimeType: "text/plain",
    name: "wrong.txt",
  });
  await expect(page.locator('[data-slot="workspace-message"]')).toHaveText(
    "Nenhum arquivo compatível foi importado.",
  );
  expect(await persistedEntities(page)).toHaveLength(0);

  await chooseImportFiles({
    buffer: Buffer.from("%PDF-1.4"),
    mimeType: "application/pdf",
    name: "accepted.pdf",
  });
  await expect(page.locator('[data-slot="workspace-message"]')).toHaveText(
    "1 objeto importado.",
  );
  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      return entities.map(
        (entity: {
          fileName?: string;
          objectTypeId: string;
          title: string;
        }) => ({
          fileName: entity.fileName,
          objectTypeId: entity.objectTypeId,
          title: entity.title,
        }),
      );
    })
    .toEqual([
      {
        fileName: "accepted.pdf",
        objectTypeId: "pdf",
        title: "accepted",
      },
    ]);
  expect(errors).toEqual([]);
});

test("Atomic note object-type commands render named outcomes", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await selectNewObject(page, "Nota atômica");
  await writeCreatedObjectTitle(page, "Atomic alpha");
  await selectNewObject(page, "Nota atômica");
  await writeCreatedObjectTitle(page, "Atomic beta");
  expect(await persistedEntities(page)).toHaveLength(2);

  await page
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Notas atômicas" })
    .getByRole("button")
    .filter({ hasText: "Notas atômicas" })
    .click();
  const workspace = objectTypeWorkspace(page);
  await expect(workspace).toBeVisible();

  await workspace
    .getByRole("tab", { name: "Visão geral", exact: true })
    .click();
  await expect(
    workspace.locator('[data-slot="object-type-overview"]'),
  ).toBeVisible();
  await expect(workspace).toContainText("Recentemente aberto");
  await expect(workspace).toContainText("Coleções");
  await expect(workspace).toContainText("Queries");

  await workspace.getByRole("button", { name: "Buscar", exact: true }).click();
  const search = workspace.getByPlaceholder("Buscar título…");
  await expect(search).toBeVisible();
  await search.fill("alpha");
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();
  expect(await persistedEntities(page)).toHaveLength(2);

  await workspace.getByRole("tab", { name: "Tudo", exact: true }).click();
  await workspace.getByRole("button", { name: "Filtrar", exact: true }).click();
  const filterRow = workspace.locator('[data-slot="object-type-filter-row"]');
  await expect(filterRow).toBeVisible();
  await expect(filterRow).toContainText("onde");
  await filterRow.getByRole("button", { name: "Todos os objetos" }).click();
  await expect(
    workspace.locator('[data-slot="object-type-all"]'),
  ).toContainText("Nenhum objeto correspondente");
  await filterRow.getByRole("button", { name: "Sem título" }).click();
  await page.keyboard.press("Escape");
  await expect(filterRow).toBeHidden();

  await workspace.getByRole("button", { name: "Ordenar", exact: true }).click();
  const sortRow = workspace.locator('[data-slot="object-type-sort-row"]');
  await expect(sortRow).toBeVisible();
  await expect(sortRow).toContainText("Classificar por");
  await sortRow.getByRole("button", { name: "Criados recentemente" }).click();
  await page.keyboard.press("Escape");
  await expect(sortRow).toBeHidden();

  await workspace.getByRole("button", { name: "Agrupar", exact: true }).click();
  const groupRow = workspace.locator('[data-slot="object-type-group-row"]');
  await expect(groupRow).toBeVisible();
  await expect(groupRow).toContainText("Agrupar por");
  await groupRow.getByRole("button", { name: "Sem agrupamento" }).click();
  await expect(
    workspace.locator('[data-slot="object-type-all"][data-grouped="true"]'),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(groupRow).toBeHidden();

  await workspace.getByRole("button", { name: "Lista", exact: true }).click();
  await expect(
    workspace.locator('[data-lifecycle-contract="object-projection-row"]'),
  ).toHaveCount(2);
  await workspace.getByRole("button", { name: "Grade", exact: true }).click();
  await expect(
    workspace.locator('[data-lifecycle-contract="object-projection-card"]'),
  ).toHaveCount(2);
  await expect(
    workspace.locator('[data-slot="object-type-all"]'),
  ).toHaveAttribute("data-layout", "grid");
  expect(await persistedEntities(page)).toHaveLength(2);
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
  await workspace
    .getByRole("button", { name: "Incorporar", exact: true })
    .click();

  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      const source = entities.find(
        (entity: { title: string }) => entity.title === "Embed source",
      );
      const lastNode = source?.body?.doc?.content?.at(-1);
      return {
        childType: lastNode?.content?.[0]?.type,
        linkMarkType: source?.body?.doc?.content
          ?.flatMap(
            (node: { content?: { marks?: { type: string }[] }[] }) =>
              node.content ?? [],
          )
          .flatMap((node: { marks?: { type: string }[] }) => node.marks ?? [])
          .find((mark: { type: string }) => mark.type === "objectLink")?.type,
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
    workspace.locator('[data-slot="workspace-object-page-column"]'),
  ).toBeHidden();
  await expect(
    workspace.getByRole("button", { name: "Expandir editor", exact: true }),
  ).toBeVisible();
  await expect(
    workspace.getByRole("button", { name: "Expandir editor", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(
    workspace.getByRole("button", { name: "Expandir editor", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    workspace.getByRole("textbox", { name: "Título" }),
  ).toBeVisible();
  await expect(
    workspace.getByRole("button", { name: "Recolher editor", exact: true }),
  ).toBeFocused();
  expect(errors).toEqual([]);
});

test("Page related content only renders explicit collection or link relations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Unrelated source page");
  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Unrelated active page");
  await expect(
    createdObjectWorkspace(page).locator(
      '[data-slot="workspace-object-related-content"]',
    ),
  ).toHaveCount(0);

  await createPageCollection(page, "Related collection");
  await page.getByRole("tab", { name: "Unrelated source page" }).click();
  await createdObjectWorkspace(page)
    .getByRole("textbox", { name: "Coleções", exact: true })
    .focus();
  await page
    .locator('[data-slot="popover-content"][data-open]')
    .getByRole("button", { name: "Related collection" })
    .click();
  await page.getByRole("tab", { name: "Unrelated active page" }).click();
  await createdObjectWorkspace(page)
    .getByRole("textbox", { name: "Coleções", exact: true })
    .focus();
  await page
    .locator('[data-slot="popover-content"][data-open]')
    .getByRole("button", { name: "Related collection" })
    .click();

  const related = createdObjectWorkspace(page).locator(
    '[data-slot="workspace-object-related-content"]',
  );
  await expect(related).toBeVisible();
  await expect(related).toContainText("Unrelated source page");
  expect(errors).toEqual([]);
});

test("deleting the active Page removes stale tabs and selects a valid fallback", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Fallback page");
  await createPageObject(page);
  await writeCreatedObjectTitle(page, "Delete me page");

  await createdObjectWorkspace(page)
    .getByRole("button", { name: "Mais opções", exact: true })
    .click();
  await page.getByRole("menuitem", { name: "Excluir Objeto" }).click();

  await expect(
    page.locator('[aria-label="Workspace tabs"] [role="tab"]').filter({
      hasText: "Delete me page",
    }),
  ).toHaveCount(0);
  await expect(
    page.locator('[data-tab-id="created-page-2"] [role="tab"]'),
  ).toHaveCount(0);
  await expect(createdObjectWorkspace(page)).toBeVisible();
  await expectActiveEditorTitle(page, "Fallback page");
  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      return entities.map((entity: { title: string }) => entity.title);
    })
    .toEqual(["Fallback page"]);
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
  await expect(collectionScreen).toContainText("Objetos da coleção");
  await expect(collectionScreen).toContainText("Nenhum objeto correspondente");
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
  await expect(queryScreen).toContainText("Resultados da query");
  await expect(queryScreen).toContainText("Nenhum objeto correspondente");
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

test("navigating away flushes a buffered title without duplicating its Page", async ({
  page,
}) => {
  const title = "Flush on navigation";
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  await createPageObject(page);

  const workspace = createdObjectWorkspace(page);
  await workspace.getByRole("textbox", { name: "Título" }).fill(title);
  await page.getByRole("button", { name: "Tabelas", exact: true }).click();

  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      return entities.filter(
        (entity: { objectTypeId: string; title: string }) =>
          entity.objectTypeId === "page" && entity.title === title,
      ).length;
    })
    .toBe(1);
  await page.getByRole("tab", { name: title, exact: true }).click();
  await expectActiveEditorTitle(page, title);
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
    const mainSurface = mobile
      .locator('[data-slot="app-shell-surface-wrapper"][data-side="main"]')
      .locator('[data-slot="app-shell-surface"]')
      .first();
    await expect(mobile).toBeVisible();
    expect((await mobile.boundingBox())?.width ?? 0).toBeGreaterThan(0);
    const closedSurfaceBox = await mainSurface.boundingBox();
    expect(closedSurfaceBox?.x ?? 0).toBeCloseTo(10, 0);
    expect(closedSurfaceBox?.width ?? 0).toBeCloseTo(viewport.width - 20, 0);
    expect(closedSurfaceBox?.height ?? 0).toBeGreaterThan(0);
    await expectContainedUsableSurface(page, mainSurface, viewport);

    const navTrigger = mobile.locator('button[aria-label="Abrir navegação"]');
    await expect(navTrigger).toHaveAttribute("aria-expanded", "false");
    await navTrigger.click();
    const navigationDialog = page.getByRole("dialog", { name: "Navegação" });
    await expect(navigationDialog).toBeVisible();
    const navigationBox = await navigationDialog.boundingBox();
    expect(navigationBox?.width ?? 0).toBeLessThanOrEqual(viewport.width - 40);
    expect(navigationBox?.height ?? 0).toBeGreaterThan(0);
    await expectContainedUsableSurface(page, navigationDialog, viewport);
    await page.keyboard.press("Escape");
    await expect(navigationDialog).toBeHidden();
    await expect(navTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(navTrigger).toBeFocused();
    expect(await mainSurface.boundingBox()).toEqual(closedSurfaceBox);

    await navTrigger.click();
    await expect(navigationDialog).toBeVisible();
    await page.locator('[data-slot="sheet-overlay"]').click({
      position: { x: viewport.width - 1, y: viewport.height - 1 },
    });
    await expect(navigationDialog).toBeHidden();
    await expect(navTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(navTrigger).toBeFocused();
    expect(await mainSurface.boundingBox()).toEqual(closedSurfaceBox);

    const contextTrigger = mobile.locator(
      'button[aria-label="Abrir painel lateral"]',
    );
    await expect(contextTrigger).toHaveAttribute("aria-expanded", "false");
    await contextTrigger.click();
    const contextDialog = page.getByRole("dialog", { name: "Painel lateral" });
    await expect(contextDialog).toBeVisible();
    const contextBox = await contextDialog.boundingBox();
    expect(contextBox?.width ?? 0).toBeLessThanOrEqual(viewport.width - 40);
    expect(contextBox?.height ?? 0).toBeGreaterThan(0);
    await expectContainedUsableSurface(page, contextDialog, viewport);
    await page.keyboard.press("Escape");
    await expect(contextDialog).toBeHidden();
    await expect(contextTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(contextTrigger).toBeFocused();
    expect(await mainSurface.boundingBox()).toEqual(closedSurfaceBox);

    await contextTrigger.click();
    await expect(contextDialog).toBeVisible();
    await page.locator('[data-slot="sheet-overlay"]').click({
      position: { x: 1, y: viewport.height - 1 },
    });
    await expect(contextDialog).toBeHidden();
    await expect(contextTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(contextTrigger).toBeFocused();
    expect(await mainSurface.boundingBox()).toEqual(closedSurfaceBox);
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

test("Novo Page and Table flows keep split actions, writes, and counts durable", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);
  const sidebar = page.locator('[data-slot="app-shell-sidebar"]');
  const pageRow = sidebar
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Páginas" })
    .first();

  await pageRow.getByRole("button", { name: "Páginas", exact: true }).click();
  const pageTypeWorkspace = page
    .locator(
      '[data-slot="workspace-object-type-view"][data-structure-id="page"]',
    )
    .filter({ visible: true });
  await expect(pageTypeWorkspace).toBeVisible();

  const pageEntitiesBefore = await persistedEntities(page);
  const pageHeader = pageTypeWorkspace.locator("header");
  const pageDisclosure = pageHeader.getByRole("button", {
    name: "Opções de novo objeto",
    exact: true,
  });
  await pageDisclosure.click();
  const pageOptions = page.locator(
    '[data-slot="dropdown-menu-content"][data-open]',
  );
  await expect(pageOptions).toBeVisible();
  expect(await persistedEntities(page)).toHaveLength(pageEntitiesBefore.length);
  await page.keyboard.press("Escape");
  await expect(pageOptions).toBeHidden();
  await expect(pageDisclosure).toBeFocused();

  await pageHeader.getByRole("button", { name: "Novo", exact: true }).click();
  const pageWorkspace = page
    .locator(
      '[data-slot="workspace-object-page-view"][data-object-type="page"]',
    )
    .filter({ visible: true });
  await expect(pageWorkspace).toBeVisible();
  const pageTitle = "Task 5.6 persisted Page";
  const pageBody = "Task 5.6 persisted Page body";
  await pageWorkspace.getByRole("textbox", { name: "Título" }).fill(pageTitle);
  await pageWorkspace.getByRole("textbox", { name: "Text" }).fill(pageBody);
  await pageWorkspace.getByRole("textbox", { name: "Título" }).blur();

  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      return entities.filter(
        (entity: { objectTypeId: string }) => entity.objectTypeId === "page",
      ).length;
    })
    .toBe(1);
  const pageEntity = (await persistedEntities(page)).find(
    (entity: { objectTypeId: string }) => entity.objectTypeId === "page",
  );
  expect(pageEntity?.id).toBeTruthy();
  await expect(pageRow).toContainText("1");
  await expect(
    page.locator(`[data-tab-id="${pageEntity?.id}"] [role="tab"]`),
  ).toHaveAttribute("aria-selected", "true");

  const tableRow = sidebar
    .locator('[data-slot="app-sidebar-object-type-row"]')
    .filter({ hasText: "Tabelas" })
    .first();
  await tableRow.getByRole("button", { name: "Tabelas", exact: true }).click();
  const tableTypeWorkspace = page
    .locator(
      '[data-slot="workspace-object-type-view"][data-structure-id="table"]',
    )
    .filter({ visible: true });
  await expect(tableTypeWorkspace).toBeVisible();
  const tableHeader = tableTypeWorkspace.locator("header");
  const tableDisclosure = tableHeader.getByRole("button", {
    name: "Opções de novo objeto",
    exact: true,
  });
  await tableDisclosure.click();
  const tableOptions = page.locator(
    '[data-slot="dropdown-menu-content"][data-open]',
  );
  await expect(tableOptions).toBeVisible();
  expect(
    (await persistedEntities(page)).filter(
      (entity: { objectTypeId: string }) => entity.objectTypeId === "table",
    ),
  ).toHaveLength(0);
  await page.keyboard.press("Escape");
  await expect(tableOptions).toBeHidden();
  await expect(tableDisclosure).toBeFocused();

  await tableHeader.getByRole("button", { name: "Novo", exact: true }).click();
  const tableWorkspace = page
    .locator(
      '[data-slot="workspace-object-page-view"][data-object-type="table"]',
    )
    .filter({ visible: true });
  await expect(tableWorkspace).toBeVisible();
  const tableTitle = "Task 5.6 persisted Table";
  await tableWorkspace
    .getByRole("textbox", { name: "Título" })
    .fill(tableTitle);
  await tableWorkspace.getByLabel("Linha 1, coluna 1").fill("Page/Table");
  await tableWorkspace.getByLabel("Linha 1, coluna 1").blur();

  await expect
    .poll(async () => {
      const entities = await persistedEntities(page);
      return entities.filter(
        (entity: { objectTypeId: string }) => entity.objectTypeId === "table",
      ).length;
    })
    .toBe(1);
  const tableEntity = (await persistedEntities(page)).find(
    (entity: { objectTypeId: string }) => entity.objectTypeId === "table",
  );
  expect(tableEntity?.id).toBeTruthy();
  await expect(tableRow).toContainText("1");

  await page.locator(`[data-tab-id="${pageEntity?.id}"] [role="tab"]`).click();
  await expect(
    page.locator(`[data-tab-id="${pageEntity?.id}"] [role="tab"]`),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    pageWorkspace.getByRole("textbox", { name: "Título" }),
  ).toHaveValue(pageTitle);

  await page.reload();
  await page.locator('[data-slot="app-shell-provider"]').waitFor();
  const reloadedPageWorkspace = page
    .locator(
      '[data-slot="workspace-object-page-view"][data-object-type="page"]',
    )
    .filter({ visible: true });
  await expect(
    reloadedPageWorkspace.getByRole("textbox", { name: "Título" }),
  ).toHaveValue(pageTitle);
  await expect(
    reloadedPageWorkspace.getByText(pageBody, { exact: true }),
  ).toBeVisible();
  await page.locator(`[data-tab-id="${tableEntity?.id}"] [role="tab"]`).click();
  await expect(
    page
      .locator(
        '[data-slot="workspace-object-page-view"][data-object-type="table"]',
      )
      .filter({ visible: true })
      .getByLabel("Linha 1, coluna 1"),
  ).toHaveValue("Page/Table");
  await expect(pageRow).toContainText("1");
  await expect(tableRow).toContainText("1");
  expect(await persistedSnapshot(page)).toMatchObject({ version: 1 });
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

test("Space lifecycle UI isolates content and guards destructive deletion", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  const errors = await openWorkspace(page);

  await page.getByRole("button", { name: "Alterar espaço" }).click();
  await page.getByRole("button", { name: "Criar espaço" }).click();
  const createDialog = page.getByRole("dialog", { name: "Criar espaço" });
  await expect(createDialog).toBeVisible();
  await createDialog.getByLabel("Nome do espaço").fill("Prototype Lab");
  await createDialog.getByRole("button", { name: "Criar" }).click();
  await expect(createDialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Alterar espaço" }),
  ).toContainText("Prototype Lab");

  await selectNewObject(page, "Página");
  await writeCreatedObjectTitle(page, "Prototype-only page");
  await expect(
    page.locator('[data-slot="app-sidebar-object-type-row"]').filter({
      hasText: "Páginas",
    }),
  ).toContainText("1");

  await page.getByRole("button", { name: "Alterar espaço" }).click();
  await page.getByRole("option", { name: /Labs/ }).click();
  await expect(
    page.getByRole("button", { name: "Alterar espaço" }),
  ).toContainText("Labs");
  await expect(
    page.locator('[data-slot="app-sidebar-object-type-row"]').filter({
      hasText: "Páginas",
    }),
  ).not.toContainText("1");

  await page.getByRole("button", { name: "Alterar espaço" }).click();
  await page.getByRole("option", { name: /Prototype Lab/ }).click();
  await expect(
    page.locator('[data-slot="app-sidebar-object-type-row"]').filter({
      hasText: "Páginas",
    }),
  ).toContainText("1");

  await page.getByRole("button", { name: "Alterar espaço" }).click();
  await page.getByRole("button", { name: "Configurações do espaço" }).click();
  const settingsDialog = page.getByRole("dialog", {
    name: "Configurações do espaço",
  });
  await expect(settingsDialog).toBeVisible();
  await settingsDialog.getByLabel("Nome do espaço").fill("Prototype Renamed");
  await settingsDialog
    .getByRole("button", { name: "Salvar alterações" })
    .click();
  await expect(settingsDialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Alterar espaço" }),
  ).toContainText("Prototype Renamed");

  await page.getByRole("button", { name: "Alterar espaço" }).click();
  await page.getByRole("button", { name: "Excluir espaço" }).click();
  const deleteDialog = page.getByRole("dialog", { name: "Excluir espaço" });
  await expect(deleteDialog).toBeVisible();
  await deleteDialog
    .getByLabel("Digite Prototype Renamed para confirmar")
    .fill("Wrong");
  await deleteDialog.getByRole("button", { name: "Excluir espaço" }).click();
  await expect(deleteDialog).toContainText("Digite o nome exato do espaço.");
  await deleteDialog
    .getByLabel("Digite Prototype Renamed para confirmar")
    .fill("Prototype Renamed");
  await deleteDialog.getByRole("button", { name: "Excluir espaço" }).click();
  await expect(deleteDialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Alterar espaço" }),
  ).toContainText("Labs");
  await expect(page.getByText("Prototype-only page")).toBeHidden();

  expect(errors).toEqual([]);
});
