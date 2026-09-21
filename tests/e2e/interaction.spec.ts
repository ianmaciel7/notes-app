import { expect, test } from "@playwright/test";
import { createObject, createSpace, ensure, signUp, visit } from "./helpers";

// spec.md 5.5 records a real prior defect where focus stayed on an offscreen
// control after a surface closed, and names it a required regression case.
test("closing a transient surface returns focus to its opener", async ({
  page,
}) => {
  await signUp(page);
  await createSpace(page, "Focus");
  await visit(page, "/space");

  const palette = page.getByPlaceholder("Search objects, or jump to a section");
  await page.getByRole("button", { name: "Search space" }).click();
  await expect(palette).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(palette).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Search space" }),
  ).toBeFocused();

  const dialog = page.getByRole("heading", { name: "Add to your Space" });
  await page.getByRole("button", { name: "New object" }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "New object" })).toBeFocused();
});

test("the mobile drawer traps then restores focus", async ({ page }) => {
  // Set up at desktop width: at mobile width the sidebar is hidden, so the
  // Space switcher the other helpers drive is not reachable.
  await signUp(page);
  await createSpace(page, "Drawer");
  await page.setViewportSize({ width: 600, height: 900 });
  await page.goto("/space");

  const opener = page.getByRole("button", { name: "Open navigation" });
  const drawer = page.getByRole("complementary", {
    name: "Space navigation",
  });
  await ensure(drawer, () => opener.click());
  await expect(drawer).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  // Not left on a control that is now offscreen.
  await expect(opener).toBeFocused();
});

test("Mod+P opens the same command dialog as Mod+K", async ({ page }) => {
  await signUp(page);
  await createSpace(page, "Shortcuts");
  await visit(page, "/space");

  const palette = page.getByPlaceholder("Search objects, or jump to a section");
  await page.keyboard.press("ControlOrMeta+p");
  await expect(palette).toBeVisible();
  // One dialog, centered — never a second competing surface (spec.md 5.5).
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(palette).toBeHidden();

  await page.keyboard.press("ControlOrMeta+k");
  await expect(palette).toBeVisible();
});

test("the palette moves through results with the keyboard alone", async ({
  page,
}) => {
  await signUp(page);
  await createSpace(page, "Keyboard");
  const noteId = await createObject(page, {
    kind: "note",
    title: "Keyboard reachable note",
    text: "Reachable without a pointer.",
  });
  await visit(page, "/space");

  await page.keyboard.press("ControlOrMeta+k");
  await page
    .getByPlaceholder("Search objects, or jump to a section")
    .fill("Keyboard reachable");
  await expect(page.getByRole("option")).toHaveCount(1);
  await page.keyboard.press("Enter");
  await page.waitForURL(`**/question/${noteId}`);
});

test("the context panel is a semantic tablist and collapses reversibly", async ({
  page,
}) => {
  await signUp(page);
  await createSpace(page, "Context");
  const noteId = await createObject(page, {
    kind: "note",
    title: "Target note",
    text: "Linked from a question.",
  });
  await createObject(page, {
    kind: "question",
    title: "Which note?",
    text: "Points at the note.",
    options: "a\nb",
    answers: "a",
    links: [noteId],
  });
  await page.goto(`/question/${noteId}`);

  const tabs = page.getByRole("tablist", { name: "Context panel" });
  await expect(tabs).toBeVisible();
  await expect(page.getByRole("tab")).toHaveCount(3);
  await expect(page.getByRole("tab", { name: /Links/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );

  // Arrow keys move within the tablist, Enter activates (spec.md 5.5).
  await page.getByRole("tab", { name: /Links/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Backlinks/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("tabpanel").getByRole("link", { name: "Which note?" }),
  ).toBeVisible();

  // Selecting a tab is view state: the object is untouched.
  await page.reload();
  await expect(page.getByRole("tab", { name: /Links/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );

  const hide = page.getByRole("button", { name: "Hide context panel" });
  await hide.click();
  await expect(tabs).toBeHidden();
  const restore = page.getByRole("button", { name: "Show context panel" });
  await expect(restore).toBeFocused();
  await restore.click();
  await expect(tabs).toBeVisible();
});

test("open object views persist, restore on reload, and close without deleting", async ({
  page,
}) => {
  await signUp(page);
  await createSpace(page, "Tabs");
  const first = await createObject(page, {
    kind: "note",
    title: "First note",
    text: "One.",
  });
  const second = await createObject(page, {
    kind: "note",
    title: "Second note",
    text: "Two.",
  });

  const strip = page.getByLabel("Open objects");
  await expect(
    strip.getByRole("button", { name: "First note", exact: true }),
  ).toBeVisible();
  await expect(
    strip.getByRole("button", { name: "Second note", exact: true }),
  ).toBeVisible();

  // A restored tab reopens the same object identity (spec.md 5.5).
  await page.reload();
  await expect(
    strip.getByRole("button", { name: "First note", exact: true }),
  ).toBeVisible();
  await strip
    .getByRole("button", { name: "First note", exact: true })
    .first()
    .click();
  await page.waitForURL(`**/question/${first}`);

  // Closing the active tab selects a successor deterministically.
  await strip.getByRole("button", { name: "Close First note" }).click();
  await page.waitForURL(`**/question/${second}`);
  await expect(
    strip.getByRole("button", { name: "First note", exact: true }),
  ).toHaveCount(0);

  // The object itself is untouched by closing its view.
  await visit(page, "/question");
  await expect(page.getByRole("link", { name: "First note" })).toBeVisible();
  await page.goto(`/question/${first}`);
  await expect(page.getByRole("heading", { name: "First note" })).toBeVisible();
});
