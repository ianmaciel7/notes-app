import { expect, type Locator, type Page, test } from "@playwright/test";

const workspaceStorageKey = "notes-app:workspace-objects:v1";

async function openPageEditor(page: Page, body = "") {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(
    ({ storageKey, initialBody }) => {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
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
          version: 1,
        }),
      );
    },
    { storageKey: workspaceStorageKey, initialBody: body },
  );
  await page.goto("/pt-BR");
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

test.afterEach(async ({ page }) => {
  await page
    .evaluate((storageKey) => {
      window.localStorage.removeItem(storageKey);
      window.sessionStorage.clear();
    }, workspaceStorageKey)
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

test("plus and six-dot grip keep their independent Capacities behaviors", async ({
  page,
}, testInfo) => {
  testInfo.snapshotSuffix = "";
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors } = await openPageEditor(
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

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(handle).toBeHidden();
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
