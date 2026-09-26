#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import {
  detectAgentType,
  findRepoRoot,
  isBiomeChecked,
  parseHookFilePath,
  readStdin,
  repoRelativePath,
} from "./hooks-lib.mjs";

const raw = await readStdin();
const agentType = detectAgentType(raw);
const root = findRepoRoot();
const filePath = parseHookFilePath(raw);
const relative = filePath && repoRelativePath(root, filePath);

if (!relative || !isBiomeChecked(relative)) {
  if (agentType === "antigravity") process.stdout.write(JSON.stringify({}));
  process.exit(0);
}

const result = spawnSync(
  "rtk",
  [
    "pnpm",
    "exec",
    "biome",
    "check",
    "--write",
    "--no-errors-on-unmatched",
    relative,
  ],
  { cwd: root, encoding: "utf8", shell: process.platform === "win32" },
);

if (result.error || result.status === 0) {
  if (agentType === "antigravity") process.stdout.write(JSON.stringify({}));
  process.exit(0);
}

if (agentType === "antigravity") {
  process.stdout.write(JSON.stringify({}));
  process.exit(0);
}

process.stderr.write(
  `Biome found issues in ${relative} that could not be auto-fixed:\n${result.stdout ?? ""}${result.stderr ?? ""}`,
);
process.exit(2);
