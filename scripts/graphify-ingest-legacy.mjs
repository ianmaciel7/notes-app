#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execSync, spawnSync } from "node:child_process";

const DEFAULT_BRANCHES = ["origin/old", "origin/old-2", "origin/old-3"];
const BRANCHES = process.env.GRAPHIFY_BRANCHES
  ? process.env.GRAPHIFY_BRANCHES.split(",").map((b) => b.trim()).filter(Boolean)
  : DEFAULT_BRANCHES;

const OUT_ROOT = resolve(process.cwd(), ".graphify-legacy-knowledge");
const BUILD_AFTER_SYNC = process.argv.includes("--build");
const INCLUDE_DOCS = process.argv.includes("--include-docs");
const IMPORT_ALL_MD = process.argv.includes("--md-only");
const PATHS_OVERRIDE = process.env.GRAPHIFY_PATHS
  ? process.env.GRAPHIFY_PATHS.split(",").map((b) => b.trim()).filter(Boolean)
  : null;
const KEEP_SOURCE = process.argv.includes("--keep-source");
const CLEAN_AFTER_BUILD = BUILD_AFTER_SYNC && !KEEP_SOURCE;
const INCLUDE_SPECIAL_MD = IMPORT_ALL_MD || INCLUDE_DOCS;

const includeDirsBase = [
  "package.json",
  "src",
  "scripts",
  ".agents/rules",
  ".agents/skills",
  ".github/workflows",
  ".github/CODEOWNERS",
  ".github/dependabot.yml",
  ".github/rulesets",
  "openspec/specs",
  "openspec/changes",
];

const includeDirsDocs = [
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  "README.md",
  "docs",
  "docs/ARCHITECTURE.md",
  "docs/DESIGN.md",
  "docs/TESTING.md",
  "docs/DEPLOYMENT.md",
  "docs/GRAPHIFY.md",
  "docs/AGENT_CONTEXT_EFFICIENCY_AUDIT.md",
  "docs/product",
  "docs/engineering",
  "docs/references",
];

const allowedCodeExt = new Set([
  ".txt",
  ".yml",
  ".yaml",
  ".json",
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".css",
  ".scss",
  ".html",
  ".toml",
  ".ini",
]);

const allowedDocExt = new Set([".md", ".mdx"]);
const allowedSpecialFiles = new Set(["agents.md", "claude.md", "gemini.md", "readme.md"]);

function isTextFile(filePath) {
  const baseName = filePath.split(/[\\/]/).pop().toLowerCase();
  const dotIndex = filePath.lastIndexOf(".");
  const ext = dotIndex >= 0 ? filePath.slice(dotIndex).toLowerCase() : "";

  if (INCLUDE_SPECIAL_MD && allowedSpecialFiles.has(baseName)) {
    return true;
  }
  if (allowedCodeExt.has(ext)) {
    return true;
  }
  if (INCLUDE_SPECIAL_MD && allowedDocExt.has(ext)) {
    return true;
  }
  return false;
}

function shouldInclude(filePath) {
  const parts = filePath.replaceAll("\\", "/");

  if (IMPORT_ALL_MD) {
    const dotIndex = filePath.lastIndexOf(".");
    const ext = dotIndex >= 0 ? filePath.slice(dotIndex).toLowerCase() : "";
    return allowedDocExt.has(ext);
  }

  const includeList = INCLUDE_DOCS ? [...includeDirsBase, ...includeDirsDocs] : includeDirsBase;
  return includeList.some((prefix) => parts === prefix || parts.startsWith(`${prefix}/`));
}

function runGit(args, cwd = process.cwd()) {
  return execSync(`git ${args}`, { encoding: "utf8", cwd });
}

function runGraphify(args, cwd) {
  const proc = spawnSync("graphify", args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (proc.error && proc.error.code === "ENOENT") {
    console.error("Graphify CLI not found. Run `pnpm run graphify:install` first.");
    return false;
  }

  if (proc.status !== 0) {
    throw new Error(`graphify command failed: graphify ${args.join(" ")}`);
  }

  return true;
}

function listFiles(branch, paths) {
  const all = new Set();

  for (const p of paths) {
    const output = runGit(`ls-tree -r --name-only ${branch} -- "${p}"`, process.cwd());
    const files = output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    for (const f of files) {
      if (!shouldInclude(f)) continue;
      if (!isTextFile(f)) continue;
      all.add(f);
    }
  }

  return [...all].sort();
}

function resolveScanPaths() {
  if (PATHS_OVERRIDE && PATHS_OVERRIDE.length > 0) {
    return PATHS_OVERRIDE;
  }
  if (IMPORT_ALL_MD) {
    return ["."];
  }
  return INCLUDE_DOCS ? [...includeDirsBase, ...includeDirsDocs] : includeDirsBase;
}

function writeFileFromBranch(branch, filePath) {
  const content = runGit(`show ${branch}:"${filePath}"`, process.cwd());
  const outPath = resolve(OUT_ROOT, branch.replace("/", "-"), filePath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content, "utf8");
}

function collectBranch(branch) {
  const prefix = branch.replace("/", "-");
  return resolve(OUT_ROOT, prefix);
}

function fileExists(filePath) {
  return existsSync(resolve(process.cwd(), filePath));
}

function maybeCopyCurrentRepoContext() {
  if (!INCLUDE_DOCS) {
    return;
  }

  const graphifyConfigFiles = [".gitignore", "package.json", "pnpm-lock.yaml", "AGENTS.md", "CLAUDE.md", "GEMINI.md"];
  const localConfigTarget = resolve(OUT_ROOT, "current-repo-context");
  mkdirSync(localConfigTarget, { recursive: true });

  for (const file of graphifyConfigFiles) {
    if (!fileExists(file)) continue;
    const content = readFileSync(resolve(process.cwd(), file), "utf8");
    const outPath = resolve(localConfigTarget, file);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content, "utf8");
  }
}

function cleanWorkspace(branches) {
  if (!CLEAN_AFTER_BUILD) return;

  for (const branch of branches) {
    const branchRoot = collectBranch(branch);
    rmSync(branchRoot, { recursive: true, force: true });
  }

  rmSync(resolve(OUT_ROOT, "current-repo-context"), { recursive: true, force: true });
}

function main() {
  console.log("Graphify legacy knowledge ingest starting...");

  if (!INCLUDE_DOCS) {
    console.log("Mode: code-first (no markdown docs persisted into the Graphify corpus).");
  } else {
    console.log("Mode: include docs.");
  }

  rmSync(OUT_ROOT, { recursive: true, force: true });
  mkdirSync(OUT_ROOT, { recursive: true });

  const manifest = [];
  const scanPaths = resolveScanPaths();

  for (const branch of BRANCHES) {
    console.log(`\nCollecting from ${branch}...`);
    const files = listFiles(branch, scanPaths);

    if (files.length === 0) {
      console.warn(`No files found for ${branch}.`);
      continue;
    }

    const targetBase = collectBranch(branch);
    mkdirSync(targetBase, { recursive: true });

    for (const file of files) {
      try {
        writeFileFromBranch(branch, file);
      } catch (error) {
        console.warn(`Skipping ${branch}:${file} (${error.message})`);
      }
    }

    const commit = runGit(`rev-parse ${branch}`, process.cwd()).trim();
    manifest.push({
      branch,
      commit,
      files: files.length,
      outputPath: targetBase,
    });
  }

  writeFileSync(resolve(OUT_ROOT, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  maybeCopyCurrentRepoContext();

  if (!BUILD_AFTER_SYNC) {
    console.log(`\nKnowledge corpus prepared at ${OUT_ROOT}. Run with --build to create graphify-out.`);
    return;
  }

  const helpOk = runGraphify(["--help"], OUT_ROOT);
  if (!helpOk) {
    console.error("Graphify CLI is unavailable. Sync files were created, but build was not executed.");
    process.exit(0);
  }

  const extractArgs = ["extract", ".", "--output", ".", "--no-cluster"];
  if (!INCLUDE_DOCS) {
    extractArgs.push("--code-only");
  }

  runGraphify(extractArgs, OUT_ROOT);
  runGraphify(
    ["cluster-only", ".", "--graph", "graphify-out/graph.json", "--no-viz", "--no-label"],
    OUT_ROOT
  );

  cleanWorkspace(BRANCHES);

  console.log(`\nGraphify graph created at ${OUT_ROOT}/graphify-out/GRAPH_REPORT.md`);
}

main();
