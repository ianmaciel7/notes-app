import { expect, type Page, test } from "@playwright/test";

const workspaceStorageKey = "notes-app:workspace-objects:v1";

async function openPageEditor(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
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
    .evaluate((key) => window.localStorage.removeItem(key), workspaceStorageKey)
    .catch(() => undefined);
});

test("slash menu opens after existing text, stays by the caret, and keeps Capacities leading order", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const { editor, errors } = await openPageEditor(page);
  await editor.click();
  await editor.pressSequentially("aaa /");

  const menu = page.locator('[data-slot="block-editor-slash-menu"]');
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
    await expect(options.nth(index)).toHaveText(label);
  }

  const box = await menu.boundingBox();
  const editorBox = await editor.boundingBox();
  const caret = await currentCaretRect(page);
  expect(box).not.toBeNull();
  expect(editorBox).not.toBeNull();
  expect(caret).not.toBeNull();
  expect(Math.round(box?.width ?? 0)).toBeGreaterThanOrEqual(430);
  expect(Math.round(box?.width ?? 0)).toBeLessThanOrEqual(450);

  // Regression: the menu used to fall back to viewport origin (0,0).
  expect(box?.x ?? 0).toBeGreaterThan((editorBox?.x ?? 0) - 16);
  expect(box?.y ?? 0).toBeGreaterThan((editorBox?.y ?? 0) - 16);
  expect(Math.abs((box?.x ?? 0) - (caret?.left ?? 0))).toBeLessThan(48);
  expect(box?.x ?? 0).toBeGreaterThanOrEqual(8);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(1272);
  expect(box?.y ?? 0).toBeGreaterThanOrEqual(8);
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(792);
  expect(errors).toEqual([]);
});

test("slash does not open in the middle of a word", async ({ page }) => {
  const { editor, errors } = await openPageEditor(page);
  await editor.click();
  await editor.pressSequentially("aaa/");
  await expect(page.locator('[data-slot="block-editor-slash-menu"]')).toBeHidden();
  expect(errors).toEqual([]);
});
