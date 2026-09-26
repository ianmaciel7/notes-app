#!/usr/bin/env node
import {
  classifyPath,
  detectAgentType,
  findRepoRoot,
  parseHookFilePath,
  readStdin,
  repoRelativePath,
} from "./hooks-lib.mjs";

const raw = await readStdin();
const agentType = detectAgentType(raw);
const filePath = parseHookFilePath(raw);
const root = findRepoRoot();
const relative = filePath && repoRelativePath(root, filePath);
const verdict = relative && classifyPath(relative);

if (verdict?.action === "deny") {
  if (agentType === "antigravity") {
    process.stdout.write(
      JSON.stringify({ decision: "deny", reason: verdict.reason }),
    );
    process.exit(0);
  }
  process.stderr.write(`${verdict.reason}\n`);
  process.exit(2);
}

if (verdict?.action === "ask") {
  if (agentType === "antigravity") {
    process.stdout.write(
      JSON.stringify({ decision: "ask", reason: verdict.reason }),
    );
    process.exit(0);
  }
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: verdict.reason,
      },
    }),
  );
  process.exit(0);
}

if (agentType === "antigravity") {
  process.stdout.write(JSON.stringify({ decision: "allow" }));
}
process.exit(0);
