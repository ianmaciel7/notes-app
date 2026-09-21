import { expect, type Locator, type Page } from "@playwright/test";

let seq = 0;

// Every control here is a client handler on a server-rendered page, and the
// dev server compiles routes on demand, so a click can land seconds before
// React hydrates and is then dropped silently. Retry the action until the UI
// actually reacts — checking first, so an already-settled UI is not clicked
// again (a second click would hit a dialog overlay and never resolve).
export async function ensure(settled: Locator, action: () => Promise<void>) {
  await expect(async () => {
    if (!(await settled.isVisible())) await action();
    await expect(settled).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 60_000 });
}

// The Space switcher is on every space page and opening it is harmless,
// which makes it the one control usable as a generic hydration probe.
async function waitHydrated(page: Page) {
  const menuItem = page.getByRole("menuitem", { name: "New Space" });
  await ensure(menuItem, async () => {
    await page.locator('[aria-haspopup="menu"]').first().click();
  });
  await page.keyboard.press("Escape");
  await expect(menuItem).toBeHidden();
}

export async function visit(page: Page, path: string) {
  await page.goto(path);
  await waitHydrated(page);
}

// Each spec signs up its own user against the Auth emulator. Sharing one
// account across specs would leak Space membership and study records between
// them, which is exactly what the isolation assertions are trying to prove.
export async function signUp(page: Page) {
  const email = `e2e-${Date.now()}-${seq++}@example.com`;
  await page.goto("/login");
  const submit = page.getByRole("button", { name: "Create account" });
  await ensure(submit, async () => {
    await page
      .getByRole("button", { name: "New here? Create an account" })
      .click();
  });
  await page.locator("#email").fill(email);
  await page.locator("#password").fill("test-password-123");
  await submit.click();
  await page.waitForURL("**/space");
  return email;
}

export async function createSpace(page: Page, name: string) {
  const menuItem = page.getByRole("menuitem", { name: "New Space" });
  await ensure(menuItem, async () => {
    await page.getByRole("button", { name: "No Space yet" }).click();
  });
  await menuItem.click();
  await page.locator("#space-name").fill(name);
  await page.getByRole("button", { name: "Create Space" }).click();
  await expect(page.getByRole("button", { name })).toBeVisible();
}

export async function createObject(
  page: Page,
  fields: {
    kind: string;
    title: string;
    text?: string;
    options?: string;
    answers?: string;
    links?: string[];
  },
) {
  const heading = page.getByRole("heading", { name: "Add to your Space" });
  await ensure(heading, async () => {
    await page.getByRole("button", { name: "New object" }).click();
  });
  await page.locator("#kind").selectOption(fields.kind);
  await page.locator("#title").fill(fields.title);
  if (fields.text)
    await page.locator('[contenteditable="true"]').fill(fields.text);
  if (fields.options) await page.locator("#options").fill(fields.options);
  if (fields.answers) await page.locator("#answers").fill(fields.answers);
  if (fields.links) await page.locator("#links").selectOption(fields.links);
  // Saving pushes to /question/<new id>. Matching the path pattern alone would
  // resolve instantly against the object we were already looking at, handing
  // back the previous id.
  const previous = page.url();
  await page.getByRole("button", { name: "Save object" }).click();
  await page.waitForURL(
    (url) => url.pathname.startsWith("/question/") && url.href !== previous,
  );
  return page.url().split("/").pop() as string;
}

export async function startSession(
  page: Page,
  scope: string,
  mode: "practice" | "simulated_exam",
  count = "1",
) {
  await visit(page, "/study");
  await page.locator("#scope").selectOption(scope);
  await page.locator("#count").fill(count);
  await page.locator("#mode").selectOption(mode);
  await page.getByRole("button", { name: "Begin session" }).click();
}
