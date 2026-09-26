import fs from "node:fs";
import path from "node:path";

const BIOME_EXTENSIONS = new Set([
  ".cjs",
  ".css",
  ".js",
  ".json",
  ".jsonc",
  ".mjs",
  ".ts",
  ".tsx",
]);

const GENERATED = [
  { test: (p) => p.startsWith(".agents/generated/"), owner: "`agents sync`" },
  { test: (p) => p.startsWith("graphify-out/"), owner: "graphify" },
  { test: (p) => p.startsWith(".next/"), owner: "`next build`" },
  { test: (p) => p === "CLAUDE.md", owner: "`agents sync`" },
  { test: (p) => p === ".mcp.json", owner: "`agents sync`" },
];

const CONTROLLED = [
  {
    test: (p) => p === "skills-lock.json",
    reason: "skills-lock.json is controlled configuration",
  },
  {
    test: (p) => p === "pnpm-lock.yaml",
    reason: "pnpm-lock.yaml is changed by pnpm, not by hand",
  },
  {
    test: (p) => /^\.env(\..+)?$/.test(path.posix.basename(p)),
    reason: "environment files can hold secrets",
  },
];

export function detectAgentType(raw) {
  try {
    const data = JSON.parse(raw);
    if (data?.toolCall || data?.conversationId) return "antigravity";
    if (data?.tool_input || data?.hookSpecificOutput) return "claude";
    return "generic";
  } catch {
    return "unknown";
  }
}

export function findRepoRoot(startDir = process.cwd()) {
  let curr = path.resolve(startDir);
  while (true) {
    if (fs.existsSync(path.join(curr, "package.json"))) return curr;
    const parent = path.dirname(curr);
    if (parent === curr) return path.resolve(startDir);
    curr = parent;
  }
}

export function parseHookFilePath(raw) {
  try {
    const data = JSON.parse(raw);
    const filePath =
      data?.tool_input?.file_path ??
      data?.toolCall?.args?.TargetFile ??
      data?.toolCall?.args?.path ??
      data?.tool_input?.path;
    return typeof filePath === "string" ? filePath : null;
  } catch {
    return null;
  }
}

export function repoRelativePath(root, filePath) {
  const relative = path.relative(root, path.resolve(root, filePath));
  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative))
    return null;
  return relative.split(path.sep).join("/");
}

export function isBiomeChecked(relative) {
  return BIOME_EXTENSIONS.has(path.posix.extname(relative));
}

export function classifyPath(relative) {
  const generated = GENERATED.find((rule) => rule.test(relative));
  if (generated) {
    return {
      action: "deny",
      reason: `${relative} is a generated output. Change its source and regenerate it with ${generated.owner}.`,
    };
  }
  const controlled = CONTROLLED.find((rule) => rule.test(relative));
  if (controlled) {
    return {
      action: "ask",
      reason: `${controlled.reason}. Confirm this edit is intended.`,
    };
  }
  return null;
}

export async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}
