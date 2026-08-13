import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const graphDir = path.join(root, "graphify-out");
const graphPath = path.join(graphDir, "graph.json");
const manifestPath = path.join(graphDir, "manifest.json");
const reportPath = path.join(graphDir, "GRAPH_REPORT.md");
const htmlPath = path.join(graphDir, "graph.html");
const semanticMarkerPath = path.join(graphDir, "needs_update");

const failures = [];

function fail(message) {
  failures.push(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(
      `${path.relative(root, filePath)} is not valid JSON: ${error.message}`,
    );
    return null;
  }
}

for (const filePath of [graphPath, manifestPath, reportPath, htmlPath]) {
  if (!existsSync(filePath)) {
    fail(`${path.relative(root, filePath)} is missing`);
  }
}

const graph = existsSync(graphPath) ? readJson(graphPath) : null;
const manifest = existsSync(manifestPath) ? readJson(manifestPath) : null;

if (existsSync(semanticMarkerPath)) {
  fail(
    "graphify-out/needs_update exists; semantic Graphify content needs controlled refresh",
  );
}

if (graph) {
  const nodeList = Array.isArray(graph.nodes) ? graph.nodes : [];
  const edgeList = Array.isArray(graph.edges) ? graph.edges : [];
  const nodeIds = new Set();

  if (nodeList.length === 0) {
    fail("graphify-out/graph.json has no nodes");
  }

  for (const node of nodeList) {
    const id = node?.id ?? node?.name;
    if (typeof id === "string") {
      nodeIds.add(id);
    }

    const sourceFile = node?.source_file ?? node?.file ?? node?.path;
    if (typeof sourceFile === "string") {
      if (path.isAbsolute(sourceFile)) {
        fail(`graph node contains an absolute source path: ${sourceFile}`);
      }
      if (
        sourceFile.includes("graphify-out/") ||
        sourceFile.includes("graphify-out\\")
      ) {
        fail(`graph node indexes Graphify output: ${sourceFile}`);
      }
      if (
        /(^|[/\\])(\.env(\.|$)|credentials|service-account).*|\.pem$|\.key$/i.test(
          sourceFile,
        )
      ) {
        fail(`graph node references a secret-like path: ${sourceFile}`);
      }
    }
  }

  let danglingEdges = 0;
  for (const edge of edgeList) {
    const source = edge?.source ?? edge?.from ?? edge?.src;
    const target = edge?.target ?? edge?.to ?? edge?.dst;
    if (
      typeof source === "string" &&
      typeof target === "string" &&
      (!nodeIds.has(source) || !nodeIds.has(target))
    ) {
      danglingEdges += 1;
    }
  }

  if (danglingEdges > 0) {
    fail(
      `graphify-out/graph.json has ${danglingEdges} dangling edge endpoint(s)`,
    );
  }
}

if (manifest) {
  const manifestText = JSON.stringify(manifest);
  if (
    /[A-Z]:\\Users\\/i.test(manifestText) ||
    /\/home\/[^/"']+/i.test(manifestText)
  ) {
    fail(
      "graphify-out/manifest.json contains a machine-specific absolute user path",
    );
  }
}

for (const filePath of [graphPath, manifestPath, reportPath, htmlPath]) {
  if (existsSync(filePath) && statSync(filePath).size === 0) {
    fail(`${path.relative(root, filePath)} is empty`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`Graphify artifact check failed: ${failure}`);
  }
  process.exit(1);
}

console.log("Graphify artifact check passed.");
