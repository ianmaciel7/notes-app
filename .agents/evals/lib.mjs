import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ignoredDirectories = new Set([".git",".codex",".gemini",".next","node_modules","artifacts"]);

async function filesUnder(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(root, absolute)));
    else if (entry.isFile()) files.push(path.relative(root, absolute).replaceAll("\\", "/"));
  }
  return files.sort();
}

export async function snapshot(root) {
  const result = new Map();
  for (const file of await filesUnder(root)) {
    const content = await readFile(path.join(root, file));
    result.set(file, createHash("sha256").update(content).digest("hex"));
  }
  return result;
}

export function changedFiles(before, after) {
  return [...new Set([...before.keys(), ...after.keys()])]
    .filter((file) => before.get(file) !== after.get(file)).sort();
}

export function parseJsonl(text) {
  return text.split(/\r?\n/).filter(Boolean).flatMap((line) => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
}

function deepFindNumber(value, keys) {
  if (!value || typeof value !== "object") return undefined;
  for (const [key, child] of Object.entries(value)) {
    if (keys.has(key) && typeof child === "number") return child;
  }
  for (const child of Object.values(value)) {
    const found = deepFindNumber(child, keys);
    if (found !== undefined) return found;
  }
}

export function traceMetrics(events, durationMs) {
  const serialized = events.map((event) => JSON.stringify(event));
  const lastWithUsage = [...events].reverse()
    .find((event) => /input_tokens|output_tokens|total_tokens/i.test(JSON.stringify(event)));
  return {
    durationMs,
    eventCount: events.length,
    toolCallEvents: serialized.filter((line) => /tool_call|command_execution|function_call|run_command/i.test(line)).length,
    inputTokens: deepFindNumber(lastWithUsage, new Set(["input_tokens","inputTokens"])),
    outputTokens: deepFindNumber(lastWithUsage, new Set(["output_tokens","outputTokens"])),
    totalTokens: deepFindNumber(lastWithUsage, new Set(["total_tokens","totalTokens"])),
  };
}

export async function gradeScenario({ scenario, workspace, before, after, trace, finalText, outcome }) {
  const checks = [];
  const changed = changedFiles(before, after);
  const allowed = new Set(scenario.allowedChangedFiles ?? []);
  const unexpected = changed.filter((file) => !allowed.has(file));
  checks.push({ name:"change-scope", pass:unexpected.length===0, detail:unexpected.join(", ") || changed.join(", ") || "no changes" });

  const traceText = trace.toLowerCase();
  for (const needle of scenario.traceIncludes ?? []) {
    checks.push({ name:`trace:${needle}`, pass:traceText.includes(needle.toLowerCase()), detail:needle });
  }

  const finalLower = finalText.toLowerCase();
  if (scenario.finalIncludesAny?.length) {
    checks.push({ name:"final-includes-any", pass:scenario.finalIncludesAny.some((n)=>finalLower.includes(n.toLowerCase())), detail:scenario.finalIncludesAny.join(" | ") });
  }
  if (scenario.finalForbidsAny?.length) {
    checks.push({ name:"final-forbids", pass:!scenario.finalForbidsAny.some((n)=>finalLower.includes(n.toLowerCase())), detail:scenario.finalForbidsAny.join(" | ") });
  }

  for (const expectation of scenario.fileContains ?? []) {
    let content = "";
    try { content = await readFile(path.join(workspace, expectation.path), "utf8"); } catch {}
    checks.push({ name:`file:${expectation.path}`, pass:content.includes(expectation.text), detail:expectation.text });
  }
  if (outcome) checks.push({ name:"outcome-command", pass:outcome.status===0, detail:`exit=${outcome.status}` });

  return { pass:checks.every((c)=>c.pass), changedFiles:changed, checks };
}
