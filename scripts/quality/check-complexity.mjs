#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import escomplex from "typhonjs-escomplex";
import ts from "typescript";

const DEFAULT_MAX = 10;
const DEFAULT_ROOT = "src";
const EXCLUDED_SEGMENTS = new Set(["node_modules", ".next", "build", "coverage", "graphify-out"]);

const options = parseArgs(process.argv.slice(2));
const root = path.resolve(options.root ?? DEFAULT_ROOT);
const max = Number(options.max ?? DEFAULT_MAX);

if (!Number.isInteger(max) || max < 1) {
  console.log(`Invalid --max value: ${String(options.max)}`);
  process.exit(1);
}

const files = await collectSourceFiles(root);

if (files.length === 0) {
  console.log(`No source files were analyzed under ${root}.`);
  process.exit(1);
}

const violations = [];
const parseFailures = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const analyzableSource = transpileForAnalysis(source, file);

  try {
    const report = escomplex.analyzeModule(analyzableSource, { commonjs: true });
    for (const method of report.methods ?? []) {
      if (method.cyclomatic > max) {
        violations.push({
          file,
          name: method.name || "<anonymous>",
          line: method.lineStart ?? 1,
          value: method.cyclomatic,
        });
      }
    }
  } catch (error) {
    parseFailures.push({
      file,
      message: error instanceof Error ? error.message : "Unknown parse failure",
    });
  }
}

if (parseFailures.length > 0) {
  console.log(`FAIL cyclomatic complexity: ${parseFailures.length} file(s) could not be analyzed.`);
  for (const failure of parseFailures) {
    console.log(`${formatPath(failure.file)}: ${failure.message}`);
  }
  process.exit(1);
}

if (violations.length > 0) {
  console.log(`FAIL cyclomatic complexity: ${violations.length} function(s) exceed max ${max}.`);
  for (const violation of violations) {
    console.log(
      `${formatPath(violation.file)}:${violation.line} ${violation.name} cyclomatic=${violation.value}`,
    );
  }
  process.exit(1);
}

console.log(`PASS cyclomatic complexity: ${files.length} files analyzed, max ${max}.`);

async function collectSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error) => {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const normalized = fullPath.replaceAll("\\", "/");

    if (entry.isDirectory()) {
      if (!EXCLUDED_SEGMENTS.has(entry.name) && normalized !== "src/components/ui") {
        files.push(...(await collectSourceFiles(fullPath)));
      }
      continue;
    }

    if (isSourceFile(entry.name) && !isExcludedFile(normalized)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function isSourceFile(name) {
  return name.endsWith(".ts") || name.endsWith(".tsx");
}

function isExcludedFile(file) {
  return (
    file.endsWith(".d.ts") ||
    file.endsWith(".test.ts") ||
    file.endsWith(".test.tsx") ||
    file.endsWith(".stories.tsx") ||
    file.includes("/src/components/ui/")
  );
}

function parseArgs(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--root") {
      parsed.root = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--max") {
      parsed.max = args[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function transpileForAnalysis(source, file) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      jsx: file.endsWith(".tsx") ? ts.JsxEmit.ReactJSX : ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: file,
    reportDiagnostics: true,
  });

  const diagnostics = result.diagnostics ?? [];
  if (diagnostics.length > 0) {
    const message = diagnostics
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
      .join("\n");
    throw new Error(message);
  }

  return result.outputText;
}

function formatPath(file) {
  return path.relative(process.cwd(), file).replaceAll("\\", "/");
}
