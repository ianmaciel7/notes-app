import { readFile, writeFile } from "node:fs/promises";

async function replace(path, pairs) {
  let source = await readFile(path, "utf8");
  for (const [before, after] of pairs) {
    if (!source.includes(before)) {
      throw new Error(`Expected source fragment not found in ${path}: ${before}`);
    }
    source = source.replace(before, after);
  }
  await writeFile(path, source);
}

await replace("src/components/app-header.tsx", [
  ["flex h-[58px] w-full", "flex h-[46px] w-full"],
]);
await replace("src/components/app-shell.tsx", [
  ["flex h-[58px] shrink-0", "flex h-[46px] shrink-0"],
]);
await replace("src/components/app-side-panel-header.tsx", [
  ["flex h-[58px] w-full", "flex h-[46px] w-full"],
]);
await replace("src/components/app-header-tabs.tsx", [
  ["flex h-[58px] shrink-0", "flex h-[46px] shrink-0"],
]);

await replace("src/components/app-sidebar-primary-actions.tsx", [[
`  const normalizedQuery = normalizeMenuQuery(query.trim());
  const localizedItems = objectTypes;
  const items = React.useMemo(
    () =>
      localizedItems.filter((item) =>
        normalizeMenuQuery(item.label).includes(normalizedQuery),
      ),
    [localizedItems, normalizedQuery],
  );`,
`  const normalizedQuery = normalizeMenuQuery(query.trim());
  const newMenuOrder = React.useMemo(
    () =>
      new Map(
        [
          "page",
          "table",
          "task",
          "weblink",
          "image",
          "pdf",
          "audio",
          "file",
          "tweet",
          "tag",
          "query",
          "ai-chat",
        ].map((id, index) => [id, index]),
      ),
    [],
  );
  const localizedItems = React.useMemo(
    () =>
      [...objectTypes].sort((left, right) => {
        const leftRank = newMenuOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER;
        const rightRank = newMenuOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER;
        return leftRank - rightRank;
      }),
    [newMenuOrder, objectTypes],
  );
  const items = React.useMemo(
    () =>
      localizedItems.filter((item) =>
        normalizeMenuQuery(item.label).includes(normalizedQuery),
      ),
    [localizedItems, normalizedQuery],
  );`
], [
  '"box-content h-[361px] w-[22rem] min-w-0 max-w-[calc(100vw-1rem)] gap-0 rounded-[12px]',
  '"box-content h-[361px] w-[352px] min-w-0 max-w-[calc(100vw-1rem)] gap-0 rounded-[12px]'
]]);

await replace("src/components/workspace-content.tsx", [[
`import {
  workspaceOverflowMenuContentClass,
  workspaceOverflowMenuItemClass,
} from "@/components/ui/compact-menu";`,
`import {
  compactMenuItemClass,
  compactMenuSurfaceClass,
  workspaceOverflowMenuContentClass,
  workspaceOverflowMenuItemClass,
} from "@/components/ui/compact-menu";`
], [
  'className="w-[257px] min-w-[257px] gap-0 p-1.5"',
  'className={cn(compactMenuSurfaceClass, "w-[257px] min-w-[257px] gap-0 p-1.5")}'
], [
  'className="w-[254px] min-w-[254px] gap-0 p-1.5"',
  'className={cn(compactMenuSurfaceClass, "w-[254px] min-w-[254px] gap-0 p-1.5")}'
]]);

// Reuse the same compact row behavior for tag/collection picker options.
let workspace = await readFile("src/components/workspace-content.tsx", "utf8");
const tagStart = workspace.indexOf("function TagPropertyEditor");
const collectionStart = workspace.indexOf("function CollectionPropertyEditor");
const menuStart = workspace.indexOf("const documentMenuItemClass", collectionStart);
if (tagStart < 0 || collectionStart < 0 || menuStart < 0) {
  throw new Error("Tag/collection editor boundaries not found");
}
const beforeTag = workspace.slice(0, tagStart);
let tagBlock = workspace.slice(tagStart, collectionStart);
let collectionBlock = workspace.slice(collectionStart, menuStart);
const afterCollection = workspace.slice(menuStart);
tagBlock = tagBlock.replaceAll(
  "className={floatingSearchListItemClass}",
  "className={cn(compactMenuItemClass, floatingSearchListItemClass)}",
);
collectionBlock = collectionBlock.replaceAll(
  "className={floatingSearchListItemClass}",
  "className={cn(compactMenuItemClass, floatingSearchListItemClass)}",
);
workspace = beforeTag + tagBlock + collectionBlock + afterCollection;
await writeFile("src/components/workspace-content.tsx", workspace);

console.log("Capacities parity fix applied.");
