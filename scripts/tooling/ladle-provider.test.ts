import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

function readProjectSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${projectRoot}/`), "utf8");
}

it("wraps all Ladle stories in the app translation provider", () => {
  const providerSource = readProjectSource(".ladle/components.tsx");

  expect(providerSource).toContain('import { NextIntlClientProvider } from "next-intl"');
  expect(providerSource).toContain('import messages from "../src/messages/en.json"');
  expect(providerSource).toContain('import editorMessages from "../src/messages/editor/en.json"');
  expect(providerSource).toContain("<NextIntlClientProvider");
  expect(providerSource).toContain("messages={ladleMessages}");
});

it("keeps the global Ladle provider free of production-distorting canvas padding", () => {
  const providerSource = readProjectSource(".ladle/components.tsx");
  expect(providerSource).not.toContain("p-6");
});

it("mounts workspace header stories with the same new-content controller used by the app", () => {
  const storySource = readProjectSource("src/app/_components/workspace/space-controller.stories.tsx");

  expect(storySource).toContain("WorkspaceNewContentDialogController");
  expect(storySource).toContain("<AppShellProvider>");
  expect(storySource).toContain("<FocusModeProvider>");
  expect(storySource).toContain("<WorkspaceNewContentDialogController />");
});
