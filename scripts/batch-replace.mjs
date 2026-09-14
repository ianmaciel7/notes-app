import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

/**
 * Utility script for batch file content replacements across matching files.
 * Usage:
 *   node scripts/batch-replace.mjs <directory|file> <search> <replace> [--regex] [--update-graph]
 * 
 * Example:
 *   node scripts/batch-replace.mjs src/components/ui "Componentes / UI /" "Components / UI /"
 */

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log("Usage: node scripts/batch-replace.mjs <target-path> <search-term> <replacement> [--regex] [--update-graph]");
  process.exit(1);
}

const targetPath = path.resolve(args[0]);
const searchTerm = args[1];
const replacement = args[2];
const isRegex = args.includes("--regex");
const shouldUpdateGraph = args.includes("--update-graph");

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".git" && file !== ".next") {
        results = results.concat(getFiles(filePath));
      }
    } else {
      results.push(filePath);
    }
  }
  return results;
}

const files = fs.statSync(targetPath).isDirectory() ? getFiles(targetPath) : [targetPath];
let totalReplacements = 0;
let modifiedFiles = 0;

const pattern = isRegex ? new RegExp(searchTerm, "g") : searchTerm;

for (const file of files) {
  try {
    const content = fs.readFileSync(file, "utf8");
    let updatedContent;
    let matchCount = 0;

    if (isRegex) {
      const matches = content.match(pattern);
      matchCount = matches ? matches.length : 0;
      updatedContent = content.replace(pattern, replacement);
    } else {
      matchCount = content.split(searchTerm).length - 1;
      updatedContent = content.split(searchTerm).join(replacement);
    }

    if (matchCount > 0 && updatedContent !== content) {
      fs.writeFileSync(file, updatedContent, "utf8");
      modifiedFiles++;
      totalReplacements += matchCount;
      console.log(`✓ Modified (${matchCount} match${matchCount > 1 ? "es" : ""}): ${path.relative(process.cwd(), file)}`);
    }
  } catch (err) {
    console.error(`✗ Error processing ${file}:`, err.message);
  }
}

console.log(`\nBatch Operation Complete: ${totalReplacements} replacement(s) across ${modifiedFiles} file(s).`);

if (shouldUpdateGraph) {
  console.log("Updating graphify knowledge graph...");
  try {
    execSync("graphify update .", { stdio: "inherit" });
  } catch (err) {
    console.error("Failed to run graphify update:", err.message);
  }
}
