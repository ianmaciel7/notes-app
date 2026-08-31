import { expect, type Page, test } from "@playwright/test";

const workspaceStorageKey = "notes-app:workspace-objects:v1";
const labsWorkspaceStorageKey =
  "notes-app:workspace-objects:v1:4d0215ae-79d6-46bd-840f-8144ec5a84fb";
const workspaceSpacesStorageKey = "notes-app:workspace-spaces:v1";
const workspaceTabsStorageKey = "notes-app:workspace-tabs:v1";

async function openPageEditor(page: Page, body = "") {
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
      tabsStorageKey,
    }: {
      initialBody: string;
      labsStorageKey: string;
      spacesStorageKey: string;
      storageKey: string;
      tabsStorageKey: string;
    }) => {
      const snapshot = JSON.stringify({
          activeEntityId: "slash-menu-reference-page",
          entities: [
            {
              body: initialBody,
              collections: [],
              createdAt: "2026-01-01T00:00:00.000Z",
              id: "slash-menu-reference-page",
              kind: "document",
              objectTypeId: "page",
              tags: [],
              title: "Slash menu reference",
            },
          ],
          nextId: 2,
          version: 1,
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
    },
    {
      initialBody: body,
      labsStorageKey: labsWorkspaceStorageKey,
      spacesStorageKey: workspaceSpacesStorageKey,
      storageKey: workspaceStorageKey,
      tabsStorageKey: workspaceTabsStorageKey,
    },
  );
  await page.goto("/pt-BR");
  const editor = page
    .getByRole("textbox", { name: "Text", exact: true })
    .filter({ visible: true })
    .first();
  await expect(editor).toBeVisible();
  return { editor, errors };
}

async function currentCaretRect(page: Page) {
  return page.evaluate(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      bottom: rect.bottom,
    };
  });
}

test.afterEach(async ({ page }) => {
  await page
    .evaluate(
      ({ labsStorageKey, spacesStorageKey, storageKey, tabsStorageKey }) => {
        window.localStorage.removeItem(storageKey);
        window.localStorage.removeItem(labsStorageKey);
        window.localStorage.removeItem(spacesStorageKey);
        window.localStorage.removeItem(tabsStorageKey);
      },
      {
        labsStorageKey: labsWorkspaceStorageKey,
        spacesStorageKey: workspaceSpacesStorageKey,
        storageKey: workspaceStorageKey,
        tabsStorageKey: workspaceTabsStorageKey,
      },
    )
    .catch(() => undefined);
});

test("slash menu opens after existing text, stays by the caret, and keeps Capacities leading order", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors } = await openPageEditor(page);
  await editor.click();
  await editor.pressSequentially("aaa /");

  const menu = page
    .locator('[data-slot="block-editor-slash-menu"]')
    .filter({ visible: true })
    .first();
  await expect(menu).toBeVisible();
  const options = menu.getByRole("option");
  for (const [index, label] of [
    "Padrão",
    "Pequeno",
    "Cabeçalho 1",
    "Cabeçalho 2",
    "Cabeçalho 3",
    "Cabeçalho 4",
    "Lista de marcadores",
    "Lista alfabética",
  ].entries()) {
    await expect(options.nth(index)).toContainText(label);
  }

  const box = await menu.boundingBox();
  const editorBox = await editor.boundingBox();
  const caret = await currentCaretRect(page);
  expect(box).not.toBeNull();
  expect(editorBox).not.toBeNull();
  expect(caret).not.toBeNull();
  const menuStyle = await menu.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      borderRadius: style.borderRadius,
      maxHeight: style.maxHeight,
    };
  });
  expect(menuStyle).toEqual({
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "rgb(222, 219, 215)",
    borderRadius: "14px",
    maxHeight: "none",
  });
  expect(Math.round(box?.width ?? 0)).toBeGreaterThanOrEqual(430);
  expect(Math.round(box?.width ?? 0)).toBeLessThanOrEqual(450);

  // Regression: the menu used to fall back to viewport origin (0,0).
  expect(box?.x ?? 0).toBeGreaterThan((editorBox?.x ?? 0) - 16);
  expect(Math.abs((box?.x ?? 0) - (caret?.left ?? 0))).toBeLessThan(48);
  expect(box?.x ?? 0).toBeGreaterThanOrEqual(8);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(1272);
  expect(box?.y ?? 0).toBeGreaterThanOrEqual(8);
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(792);
  const preferredBelow = (caret?.bottom ?? 0) + 4;
  const canFitBelow = preferredBelow + (box?.height ?? 0) + 8 <= 800;
  if (canFitBelow) {
    expect(box?.y ?? 0).toBeGreaterThanOrEqual(preferredBelow - 8);
  } else {
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(
      (caret?.top ?? 0) + 8,
    );
  }
  expect(errors).toEqual([]);
});

test("slash does not open in the middle of a word", async ({ page }) => {
  const { editor, errors } = await openPageEditor(page);
  await editor.click();
  await editor.pressSequentially("aaa/");
  await expect(
    page.locator('[data-slot="block-editor-slash-menu"]'),
  ).toBeHidden();
  expect(errors).toEqual([]);
});

test("slash menu follows the caret after the workspace scrolls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const body = Array.from(
    { length: 40 },
    (_, index) => `Scrollable paragraph ${index + 1}`,
  ).join("\n");
  const { editor, errors } = await openPageEditor(page, body);
  const target = editor.locator("p").nth(24);
  await target.scrollIntoViewIfNeeded();
  await target.click();
  await page.keyboard.press("End");
  await page.keyboard.type(" /");

  const menu = page
    .locator('[data-slot="block-editor-slash-menu"]')
    .filter({ visible: true })
    .first();
  await expect(menu).toBeVisible();

  const scrollTop = await editor.evaluate((node) => {
    let ancestor = node.parentElement;
    while (ancestor) {
      const style = getComputedStyle(ancestor);
      if (
        /(auto|scroll)/.test(style.overflowY) &&
        ancestor.scrollHeight > ancestor.clientHeight
      ) {
        return ancestor.scrollTop;
      }
      ancestor = ancestor.parentElement;
    }
    return 0;
  });
  const box = await menu.boundingBox();
  const caret = await currentCaretRect(page);
  expect(scrollTop).toBeGreaterThan(0);
  expect(box).not.toBeNull();
  expect(caret).not.toBeNull();
  expect(Math.abs((box?.x ?? 0) - (caret?.left ?? 0))).toBeLessThan(48);
  expect(box?.x ?? 0).toBeGreaterThanOrEqual(8);
  expect(box?.y ?? 0).toBeGreaterThanOrEqual(8);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(1272);
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(792);
  expect(errors).toEqual([]);
});

test("slash menu flips above a caret near the viewport bottom", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const body = Array.from(
    { length: 36 },
    (_, index) => `Edge paragraph ${index + 1}`,
  ).join("\n");
  const { editor, errors } = await openPageEditor(page, body);
  const target = editor.locator("p").last();
  await target.scrollIntoViewIfNeeded();
  await target.click();
  await page.keyboard.press("End");
  await page.keyboard.type(" /");

  const menu = page
    .locator('[data-slot="block-editor-slash-menu"]')
    .filter({ visible: true })
    .first();
  await expect(menu).toBeVisible();
  const box = await menu.boundingBox();
  const caret = await currentCaretRect(page);
  expect(box).not.toBeNull();
  expect(caret).not.toBeNull();
  expect((caret?.bottom ?? 0) + (box?.height ?? 0) + 8).toBeGreaterThan(900);
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(
    (caret?.top ?? 0) + 8,
  );
  expect(box?.x ?? 0).toBeGreaterThanOrEqual(8);
  expect(box?.y ?? 0).toBeGreaterThanOrEqual(8);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(1272);
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(892);
  expect(errors).toEqual([]);
});
