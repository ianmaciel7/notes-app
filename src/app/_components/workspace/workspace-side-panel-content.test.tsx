import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { NextIntlClientProvider } from "next-intl";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import { WorkspaceProvider } from "@/app/_components/workspace/space-controller";
import { WorkspaceSidePanelContent } from "@/app/_components/workspace/workspace-side-panel-content";
import editorMessages from "@/messages/editor/en.json";
import messages from "@/messages/en.json";

const projectRoot = process.cwd();
const ladleMessages = {
  ...messages,
  workspace: {
    ...messages.workspace,
    editor: editorMessages,
  },
};

function readProjectSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${projectRoot}/`), "utf8");
}

it("renders the active side panel tab through the real workspace context", () => {
  const markup = renderToStaticMarkup(
    <NextIntlClientProvider locale="en" timeZone="UTC" messages={ladleMessages}>
      <WorkspaceProvider>
        <WorkspaceSidePanelContent />
      </WorkspaceProvider>
    </NextIntlClientProvider>,
  );

  expect(markup).toContain("Explore");
  expect(markup).toContain("Selecione um objeto");
  expect(markup).not.toContain("Implementation pending");
});

it("has Ladle stories for side panel content states", () => {
  const storySource = readProjectSource(
    "src/app/_components/workspace/workspace-side-panel-content.stories.tsx",
  );

  expect(storySource).toContain("WorkspaceSidePanelContent");
  expect(storySource).toContain("ExploreOverview");
  expect(storySource).toContain("GraphViewForObject");
  expect(storySource).toContain("SearchForObject");
});
