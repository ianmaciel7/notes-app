import { expect, type Locator, type Page, test } from "@playwright/test";
import { createInitialStructureRegistry } from "../../src/lib/workspace-object-types";

const workspaceStorageKey = "notes-app:workspace-objects:v1";
const labsWorkspaceStorageKey =
  "notes-app:workspace-objects:v1:4d0215ae-79d6-46bd-840f-8144ec5a84fb";
const workspaceSpacesStorageKey = "notes-app:workspace-spaces:v1";
const workspaceTabsStorageKey = "notes-app:workspace-tabs:v1";

async function openPageEditor(page: Page, body: unknown = "") {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(
    ({
      initialBody,
      labsStorageKey,
      spacesStorageKey,
      storageKey,
      structures,
      tabsStorageKey,
    }: {
      initialBody: unknown;
      labsStorageKey: string;
      spacesStorageKey: string;
      storageKey: string;
      structures: unknown;
      tabsStorageKey: string;
    }) => {
      const fixtureMarker = `${storageKey}:editor-interactions-fixture`;
      const marker = JSON.stringify(initialBody);
      if (window.sessionStorage.getItem(fixtureMarker) === marker) return;
      const isStructuredBody =
        typeof initialBody === "object" && initialBody !== null;
      const snapshot = JSON.stringify({
        activeEntityId: "editor-interactions-page",
        entities: [
          {
            body: initialBody,
            collections: [],
            createdAt: "2026-01-01T00:00:00.000Z",
            id: "editor-interactions-page",
            kind: "document",
            objectTypeId: "page",
            tags: [],
            title: "Editor interactions",
          },
        ],
        nextId: 2,
        ...(isStructuredBody ? { structures } : {}),
        version: isStructuredBody ? 5 : 1,
      });
      window.localStorage.removeItem(tabsStorageKey);
      window.localStorage.setItem(
        spacesStorageKey,
        JSON.stringify({
          activeSpaceId: "labs",
          spaces: [{ id: "labs", name: "Labs" }],
        }),
      );
      window.localStorage.setItem(storageKey, snapshot);
      window.localStorage.setItem(labsStorageKey, snapshot);
      window.sessionStorage.setItem(fixtureMarker, marker);
    },
    {
      initialBody: body,
      labsStorageKey: labsWorkspaceStorageKey,
      spacesStorageKey: workspaceSpacesStorageKey,
      storageKey: workspaceStorageKey,
      structures: createInitialStructureRegistry(),
      tabsStorageKey: workspaceTabsStorageKey,
    },
  );
  await page.goto("/pt-BR", { waitUntil: "domcontentloaded" });
  const workspace = page
    .locator(
      [
        '[data-slot="created-object-workspace"][data-object-type="page"]',
        '[data-slot="workspace-object-page-view"][data-object-kind="document"]',
      ].join(", "),
    )
    .filter({ visible: true });
  await expect(workspace).toBeVisible();
  const editor = workspace.getByRole("textbox", { name: "Text", exact: true });
  await expect(editor).toBeVisible();
  return { editor, errors, workspace };
}

async function expectParagraphTexts(editor: Locator, expected: string[]) {
  await expect
    .poll(() => editor.locator("p").allTextContents())
    .toEqual(expected);
}

async function hoverParagraph(editor: Locator, text: string) {
  const paragraph = editor.locator("p").filter({ hasText: text }).first();
  await expect(paragraph).toBeVisible();
  await paragraph.hover();
  return paragraph;
}

async function blockIds(editor: Locator) {
  return editor
    .locator("[data-block-id]")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-block-id")),
    );
}

async function blockIdForText(editor: Locator, text: string) {
  const block = editor
    .locator("[data-block-id]")
    .filter({ hasText: text })
    .first();
  await expect(block).toBeVisible();
  return block.getAttribute("data-block-id");
}

async function visibleBlockHandleForParagraph(page: Page, paragraph: Locator) {
  const paragraphBox = await paragraph.boundingBox();
  expect(paragraphBox).not.toBeNull();
  const handles = page
    .locator('[data-slot="block-editor-block-handle"]')
    .filter({ visible: true });
  await expect(handles.first()).toBeVisible();
  const index = await handles.evaluateAll((nodes, box) => {
    const targetY = box?.y ?? 0;
    return nodes.reduce(
      (best, node, currentIndex) => {
        const distance = Math.abs(node.getBoundingClientRect().y - targetY);
        return distance < best.distance
          ? { distance, index: currentIndex }
          : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    ).index;
  }, paragraphBox);
  return handles.nth(index);
}

test.afterEach(async ({ page }) => {
  await page
    .evaluate(({ labsStorageKey, spacesStorageKey, storageKey, tabsStorageKey }) => {
      window.localStorage.removeItem(storageKey);
      window.localStorage.removeItem(labsStorageKey);
      window.localStorage.removeItem(spacesStorageKey);
      window.localStorage.removeItem(tabsStorageKey);
      window.sessionStorage.clear();
    }, {
      labsStorageKey: labsWorkspaceStorageKey,
      spacesStorageKey: workspaceSpacesStorageKey,
      storageKey: workspaceStorageKey,
      tabsStorageKey: workspaceTabsStorageKey,
    })
    .catch(() => undefined);
});

test("selection toolbar preserves text while applying and removing a link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors } = await openPageEditor(page);

  await editor.click();
  await editor.pressSequentially("Texto para link");
  await editor.press("ControlOrMeta+A");

  const toolbar = page
    .locator('[data-slot="block-editor-selection-menu"]')
    .filter({ visible: true })
    .last();
  await expect(toolbar).toBeVisible();
  await toolbar.getByRole("button", { name: "Link", exact: true }).click();

  const linkPopover = page.locator('[data-slot="block-editor-link-popover"]');
  await expect(linkPopover).toBeVisible();
  await linkPopover
    .getByRole("textbox", { name: "URL do link" })
    .fill("example.com");
  await linkPopover.getByRole("button", { name: "Aplicar link" }).click();

  const link = editor.locator('a[href="https://example.com"]');
  await expect(link).toHaveText("Texto para link");

  await editor.click();
  await editor.press("ControlOrMeta+A");
  await expect(toolbar).toBeVisible();
  await toolbar.getByRole("button", { name: "Link", exact: true }).click();
  await expect(linkPopover).toBeVisible();
  await linkPopover.getByRole("button", { name: "Remover link" }).click();
  await expect(editor.locator("a")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("external paste allocates fresh ids even when pasted ids do not collide", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors } = await openPageEditor(page, "Source");
  const before = await blockIds(editor);

  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.evaluate(async () => {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob(
          [
            '<h2 data-block-id="external-heading-id">External heading</h2><p data-block-id="external-paste-id">External paragraph</p>',
          ],
          { type: "text/html" },
        ),
        "text/plain": new Blob(["External heading\n\nExternal paragraph"], {
          type: "text/plain",
        }),
      }),
    ]);
  });

  await editor.locator("p").first().click();
  await editor.press("End");
  await editor.press("ControlOrMeta+V");

  await expect(
    editor.locator("p").filter({ hasText: "External paragraph" }),
  ).toBeVisible();
  const after = await blockIds(editor);
  expect(after).toHaveLength(3);
  expect(new Set(after).size).toBe(3);
  expect(after).toContain(before[0]);
  expect(after).not.toContain("external-paste-id");
  expect(errors).toEqual([]);
});

test("existing block ids survive edits, transforms, reorder, reload, and mobile layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors } = await openPageEditor(
    page,
    ["Alpha", "Beta", "Gamma"].join("\n"),
  );
  const initialAlphaId = await blockIdForText(editor, "Alpha");
  const initialBetaId = await blockIdForText(editor, "Beta");
  const initialGammaId = await blockIdForText(editor, "Gamma");

  await editor.click();
  await editor.press("ControlOrMeta+Home");
  await editor.press("End");
  await editor.pressSequentially(" edited");
  expect(await blockIdForText(editor, "Alpha edited")).toBe(initialAlphaId);
  await page.keyboard.press("ControlOrMeta+Z");
  expect(await blockIdForText(editor, "Alpha")).toBe(initialAlphaId);
  await page.keyboard.press("ControlOrMeta+Shift+Z");
  expect(await blockIdForText(editor, "Alpha edited")).toBe(initialAlphaId);

  const beta = editor.locator("p").filter({ hasText: "Beta" }).first();
  await beta.hover();
  const betaHandle = await visibleBlockHandleForParagraph(page, beta);
  await betaHandle.getByRole("button", { name: "Opções do bloco" }).click();
  const blockMenu = page.locator('[data-slot="block-editor-block-menu"]');
  await expect(blockMenu).toBeVisible();
  await blockMenu.getByRole("menuitem", { name: "Cabeçalho 2" }).click();
  const betaHeading = editor.locator("h2").filter({ hasText: "Beta" }).first();
  await expect(betaHeading).toBeVisible();
  expect(await blockIdForText(editor, "Beta")).toBe(initialBetaId);
  await betaHeading.hover();
  const duplicateHandle = await visibleBlockHandleForParagraph(
    page,
    betaHeading,
  );
  await duplicateHandle
    .getByRole("button", { name: "Opções do bloco" })
    .click();
  await blockMenu.getByRole("menuitem", { name: "Duplicar bloco" }).click();
  const betaIds = await editor
    .locator("h2")
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-block-id")),
    );
  expect(betaIds).toHaveLength(2);
  expect(new Set(betaIds).size).toBe(2);
  expect(betaIds).toContain(initialBetaId);

  await editor.click();
  await editor.press("ControlOrMeta+End");
  await editor.press("End");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Split");
  const splitId = await blockIdForText(editor, "Split");
  expect(splitId).not.toBe(initialGammaId);
  await editor.press("ControlOrMeta+End");
  await editor.press("End");
  await editor.press("Home");
  await editor.press("Backspace");
  expect(await blockIdForText(editor, "GammaSplit")).toBe(initialGammaId);

  const alphaEdited = editor
    .locator("p")
    .filter({ hasText: "Alpha edited" })
    .first();
  await alphaEdited.hover();
  const alphaHandle = await visibleBlockHandleForParagraph(page, alphaEdited);
  const alphaGrip = alphaHandle.getByRole("button", {
    name: "Opções do bloco",
  });
  const gammaMerged = editor
    .locator("p")
    .filter({ hasText: "GammaSplit" })
    .first();
  const gammaBox = await gammaMerged.boundingBox();
  expect(gammaBox).not.toBeNull();
  await alphaGrip.dragTo(gammaMerged, {
    targetPosition: {
      x: 8,
      y: Math.max(2, (gammaBox?.height ?? 24) - 2),
    },
  });
  await expect
    .poll(() => editor.locator("p").allTextContents())
    .toEqual(["Alpha edited", "GammaSplit"]);
  expect(await blockIdForText(editor, "Alpha edited")).toBe(initialAlphaId);
  expect(await blockIdForText(editor, "GammaSplit")).toBe(initialGammaId);

  await editor.blur();
  await expect
    .poll(() =>
      page.evaluate((storageKey) => {
        const snapshot = window.localStorage.getItem(storageKey);
        return snapshot?.includes("Alpha edited") ?? false;
      }, workspaceStorageKey),
    )
    .toBe(true);
  await page.reload();
  const restoredEditor = page.getByRole("textbox", {
    name: "Text",
    exact: true,
  });
  await expect(restoredEditor).toBeVisible();
  expect(await blockIdForText(restoredEditor, "Alpha edited")).toBe(
    initialAlphaId,
  );
  expect(await blockIdForText(restoredEditor, "Beta")).toBe(initialBetaId);
  expect(await blockIdForText(restoredEditor, "GammaSplit")).toBe(
    initialGammaId,
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page
      .locator('[data-slot="block-editor-block-handle"]')
      .filter({ visible: true }),
  ).toHaveCount(0);
  expect(await blockIdForText(restoredEditor, "Alpha edited")).toBe(
    initialAlphaId,
  );
  expect(errors).toEqual([]);
});

test("read-only backlink previews preserve source block identity without edit controls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript((storageKey) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        activeEntityId: "target-page",
        entities: [
          {
            body: {
              schemaVersion: 2,
              doc: {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    attrs: { id: "block:source-page:0" },
                    content: [
                      {
                        type: "text",
                        text: "Read-only source mentions target",
                        marks: [
                          {
                            type: "link",
                            attrs: { href: "object:target-page" },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            collections: [],
            createdAt: "2026-01-01T00:00:00.000Z",
            id: "source-page",
            kind: "document",
            objectTypeId: "page",
            propertyValues: {},
            tags: [],
            title: "Source page",
          },
          {
            body: {
              schemaVersion: 2,
              doc: {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    attrs: { id: "block:target-page:0" },
                    content: [{ type: "text", text: "Target body" }],
                  },
                ],
              },
            },
            collections: [],
            createdAt: "2026-01-01T00:00:00.000Z",
            id: "target-page",
            kind: "document",
            objectTypeId: "page",
            propertyValues: {},
            tags: [],
            title: "Target page",
          },
        ],
        nextId: 3,
        version: 2,
      }),
    );
  }, workspaceStorageKey);
  await page.goto("/pt-BR");

  const preview = page
    .locator(
      '[data-testid="app-shell-main"] [data-slot="workspace-readonly-backlink-preview"]',
    )
    .filter({ hasText: "Source page" });
  await expect(preview).toBeVisible();
  const readonlyEditor = preview.getByRole("document", { name: "Text" });
  await expect(readonlyEditor).toHaveAttribute("contenteditable", "false");
  await expect(readonlyEditor).toContainText(
    "Read-only source mentions target",
  );
  await expect(
    preview.locator('[data-slot="block-editor-block-handle"]'),
  ).toHaveCount(0);
  expect(await blockIdForText(readonlyEditor, "Read-only source")).toBe(
    "block:source-page:0",
  );

  await readonlyEditor.click();
  await page.keyboard.type(" edited");
  await expect(readonlyEditor).not.toContainText("edited");
  expect(await blockIdForText(readonlyEditor, "Read-only source")).toBe(
    "block:source-page:0",
  );
  expect(errors).toEqual([]);
});

test("plus and six-dot grip keep their independent Capacities behaviors", async ({
  page,
}, testInfo) => {
  testInfo.snapshotSuffix = "";
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors, workspace } = await openPageEditor(
    page,
    ["Alpha", "Beta", "Gamma"].join("\n"),
  );
  await expectParagraphTexts(editor, ["Alpha", "Beta", "Gamma"]);
  const alpha = await hoverParagraph(editor, "Alpha");

  const alphaBox = await alpha.boundingBox();
  expect(alphaBox).not.toBeNull();

  const handles = page
    .locator('[data-slot="block-editor-block-handle"]')
    .filter({ visible: true });
  await expect(handles.first()).toBeVisible();
  const handleIndex = await handles.evaluateAll((nodes, box) => {
    const targetY = box?.y ?? 0;
    return nodes.reduce(
      (best, node, index) => {
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.y - targetY);
        return distance < best.distance ? { distance, index } : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    ).index;
  }, alphaBox);
  const dragRoot = page.locator(".block-editor-drag-handle").nth(handleIndex);
  const handle = handles.nth(handleIndex);
  const insertControl = handle.getByRole("button", {
    name: "Inserir bloco",
    exact: true,
  });
  const dragControl = handle.getByRole("button", {
    name: "Opções do bloco",
    exact: true,
  });
  const menuAnchor = handle.locator('[data-slot="block-editor-menu-anchor"]');
  await expect(handle).toBeVisible();
  await expect(insertControl).toBeVisible();
  await expect(dragControl).toBeVisible();
  await expect(menuAnchor).toHaveCount(1);
  await expect(
    dragControl.locator('[data-slot="block-editor-six-dot-icon"] circle'),
  ).toHaveCount(6);

  expect(
    await dragRoot.evaluate((node) => (node as HTMLElement).draggable),
  ).toBe(true);
  expect(
    await insertControl.evaluate((node) => (node as HTMLElement).draggable),
  ).toBe(false);
  expect(
    await dragControl.evaluate((node) => (node as HTMLElement).draggable),
  ).toBe(true);

  const handleBox = await handle.boundingBox();
  const insertBox = await insertControl.boundingBox();
  const dragBox = await dragControl.boundingBox();
  expect(handleBox).not.toBeNull();
  expect(insertBox).not.toBeNull();
  expect(dragBox).not.toBeNull();
  expect(Math.round(insertBox?.width ?? 0)).toBe(18);
  expect(Math.round(insertBox?.height ?? 0)).toBe(22);
  expect(Math.round(dragBox?.width ?? 0)).toBe(18);
  expect(Math.round(dragBox?.height ?? 0)).toBe(22);
  expect(Math.round(handleBox?.width ?? 0)).toBe(36);
  expect(dragBox?.x ?? 0).toBeGreaterThan(insertBox?.x ?? 0);
  expect(handleBox?.x ?? 0).toBeLessThan(alphaBox?.x ?? 0);
  expect((handleBox?.x ?? 0) + (handleBox?.width ?? 0)).toBeLessThanOrEqual(
    (alphaBox?.x ?? 0) + 4,
  );
  expect(Math.abs((handleBox?.y ?? 0) - (alphaBox?.y ?? 0))).toBeLessThan(8);
  await expect(handle).toHaveScreenshot("block-handle-reference.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.02,
  });

  const initialOrder = await editor.locator("p").allTextContents();
  await page.mouse.move(
    (dragBox?.x ?? 0) + (dragBox?.width ?? 0) / 2,
    (dragBox?.y ?? 0) + (dragBox?.height ?? 0) / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    (dragBox?.x ?? 0) + (dragBox?.width ?? 0) / 2 + 2,
    (dragBox?.y ?? 0) + (dragBox?.height ?? 0) / 2 + 2,
  );
  await page.mouse.up();
  expect(await editor.locator("p").allTextContents()).toEqual(initialOrder);
  await expect(
    page.locator('[data-slot="block-editor-block-menu"]'),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  await insertControl.dispatchEvent("pointerdown", {
    bubbles: true,
    cancelable: true,
    pointerId: 17,
    pointerType: "mouse",
  });
  expect(
    await dragRoot.evaluate((node) => (node as HTMLElement).draggable),
  ).toBe(false);
  await page.locator("body").dispatchEvent("pointercancel", {
    bubbles: true,
    pointerId: 17,
    pointerType: "mouse",
  });
  expect(
    await dragRoot.evaluate((node) => (node as HTMLElement).draggable),
  ).toBe(true);

  const beta = editor.locator("p").filter({ hasText: "Beta" }).first();
  await beta.hover();
  await expect
    .poll(async () => {
      const [currentHandleBox, betaBox] = await Promise.all([
        handle.boundingBox(),
        beta.boundingBox(),
      ]);
      return Math.abs((currentHandleBox?.y ?? 0) - (betaBox?.y ?? 0));
    })
    .toBeLessThan(8);
  await alpha.hover();
  await expect
    .poll(async () => {
      const currentHandleBox = await handle.boundingBox();
      return Math.abs((currentHandleBox?.y ?? 0) - (alphaBox?.y ?? 0));
    })
    .toBeLessThan(8);

  await insertControl.hover();
  const insertTooltip = page.locator(
    '[data-slot="block-editor-insert-tooltip"]',
  );
  await expect(insertTooltip).toBeVisible();
  await expect(insertTooltip).toContainText("Clique");
  await expect(insertTooltip).toContainText("Shift-clique");

  await dragControl.hover();
  const dragTooltip = page.locator('[data-slot="block-editor-drag-tooltip"]');
  await expect(dragTooltip).toBeVisible();
  await expect(dragTooltip).toContainText("Arraste");
  await expect(dragTooltip).toContainText("Clique");

  await insertControl.click();
  await page.keyboard.type("Below");
  await expectParagraphTexts(editor, ["Alpha", "Below", "Beta", "Gamma"]);

  await hoverParagraph(editor, "Alpha");
  await insertControl.click({ modifiers: ["Shift"] });
  await page.keyboard.type("Above");
  await expectParagraphTexts(editor, [
    "Above",
    "Alpha",
    "Below",
    "Beta",
    "Gamma",
  ]);

  await hoverParagraph(editor, "Alpha");
  await dragControl.click();
  const blockMenu = page.locator('[data-slot="block-editor-block-menu"]');
  await expect(blockMenu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(blockMenu).toBeHidden();

  await hoverParagraph(editor, "Alpha");
  const gamma = editor.locator("p").filter({ hasText: "Gamma" }).first();
  const gammaBox = await gamma.boundingBox();
  expect(gammaBox).not.toBeNull();
  await dragControl.evaluate((control) => {
    control.addEventListener(
      "dragend",
      () => {
        queueMicrotask(() => {
          control.dispatchEvent(
            new MouseEvent("click", { bubbles: true, cancelable: true }),
          );
          document.documentElement.setAttribute(
            "data-post-drag-click-emitted",
            "true",
          );
        });
      },
      { once: true },
    );
  });
  await dragControl.dragTo(gamma, {
    targetPosition: {
      x: Math.min(12, Math.max(2, (gammaBox?.width ?? 24) / 4)),
      y: Math.max(2, (gammaBox?.height ?? 24) - 2),
    },
  });

  await expect(page.locator("html")).toHaveAttribute(
    "data-post-drag-click-emitted",
    "true",
  );
  await expect(blockMenu).toBeHidden();
  await expect
    .poll(() => editor.locator("p").allTextContents())
    .not.toEqual(["Above", "Alpha", "Below", "Beta", "Gamma"]);
  const reordered = await editor.locator("p").allTextContents();
  expect([...reordered].sort()).toEqual(
    ["Above", "Alpha", "Below", "Beta", "Gamma"].sort(),
  );
  expect(reordered.indexOf("Alpha")).toBeGreaterThan(reordered.indexOf("Beta"));

  const dropCursor = page.locator(".block-editor-dropcursor");
  await expect(dropCursor).toHaveCount(0);
  expect(errors).toEqual([]);

  await page.mouse.move(1270, 10);
  await expect(handle).toBeHidden();
  const title = workspace.getByRole("textbox", { name: "Título" });
  await title.focus();
  await expect(title).toBeFocused();
  await expect(handle).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(handle).toBeHidden();
});

test("block handles stay excluded for coarse touch pointers", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 1024, height: 768 },
  });
  const page = await context.newPage();
  try {
    const { editor } = await openPageEditor(page, "Touch target");
    await editor.locator("p").first().tap();
    await expect(
      page.locator('[data-slot="block-editor-block-handle"]'),
    ).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test("table block cells support keyboard selection, controls, persistence, and mobile containment", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors, workspace } = await openPageEditor(page);
  await editor.click();
  await editor.pressSequentially("/tabela");
  const slashMenu = page.locator('[data-slot="block-editor-slash-menu"]');
  await expect(slashMenu).toBeVisible();
  await slashMenu.getByRole("option", { name: /Tabela/ }).click();
  const table = editor.locator('[data-slot="table-block-editor"]');
  const firstCell = table.locator(".table-block-cell").nth(0);
  const secondCell = table.locator(".table-block-cell").nth(1);

  await expect(table).toBeVisible();
  await firstCell.fill("Linked page");
  await firstCell.press("Enter");
  await expect(firstCell).toContainText("Linked page");

  await firstCell.focus();
  await firstCell.press("Shift+ArrowRight");
  await expect(secondCell).toBeFocused();
  await table.getByRole("button", { name: "Highlight cells" }).click();
  await expect(firstCell).toHaveAttribute("data-background", "highlight");
  await expect(secondCell).toHaveAttribute("data-background", "highlight");

  await table.getByRole("button", { name: "+ Row" }).click();
  await expect(table.locator("tr")).toHaveCount(4);
  await table.getByRole("button", { name: "Sort" }).click();
  await expect(table.locator('[data-table-block-view]')).toBeVisible();

  await editor.blur();
  await expect
    .poll(() =>
      page.evaluate((storageKey) => {
        const snapshot =
          window.localStorage.getItem(storageKey) ??
          window.localStorage.getItem(`${storageKey}:4d0215ae-79d6-46bd-840f-8144ec5a84fb`);
        return snapshot?.includes("Linked page") ?? false;
      }, workspaceStorageKey),
    )
    .toBe(true);

  await page.reload();
  const restored = page.locator('[data-slot="table-block-editor"]');
  await expect(restored).toContainText("Linked page");

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await workspace
    .locator('[data-slot="block-editor"]')
    .evaluate((element) => ({
      document:
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
      shell: element.scrollWidth <= element.clientWidth,
    }));
  expect(overflow).toEqual({ document: true, shell: true });
  expect(errors).toEqual([]);
});

test("rendered editor preserves focus, reduced motion, mobile overflow, and a clean console", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors, workspace } = await openPageEditor(
    page,
    `Mobile ${"unbroken".repeat(40)}`,
  );
  const editorShell = workspace.locator('[data-slot="block-editor"]');

  await editor.focus();
  await expect(editor).toBeFocused();
  expect(
    await editor.evaluate((element) => element.matches(":focus-visible")),
  ).toBe(true);
  const focusStyle = await editor.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    };
  });
  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(focusStyle.outlineWidth).toBe("2px");

  const paragraph = editor.locator("p").first();
  await paragraph.hover();
  const handle = page
    .locator('[data-slot="block-editor-block-handle"]')
    .filter({ visible: true })
    .first();
  await expect(handle).toBeVisible();
  const handleMotion = await handle.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      animationCount: element.getAnimations().length,
      transitionProperty: style.transitionProperty,
    };
  });
  expect(handleMotion).toEqual({
    animationCount: 0,
    transitionProperty: "none",
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(handle).toBeHidden();
  const overflow = await editorShell.evaluate((element) => ({
    document:
      document.documentElement.scrollWidth <=
      document.documentElement.clientWidth,
    editor: element.querySelector(".notes-block-editor")
      ? (element.querySelector(".notes-block-editor")?.scrollWidth ?? 0) <=
        (element.querySelector(".notes-block-editor")?.clientWidth ?? 0)
      : false,
    shell: element.scrollWidth <= element.clientWidth,
  }));
  expect(overflow).toEqual({ document: true, editor: true, shell: true });
  expect(errors).toEqual([]);
});
