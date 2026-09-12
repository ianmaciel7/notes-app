#!/usr/bin/env node

/**
 * Markdown Batch Translator Script for notes-app
 * 
 * Usage:
 *   node .agents/skills/doc-translator/scripts/translate-batch.mjs [options]
 * 
 * Options:
 *   --dir <path>       Target directory containing markdown files (default: docs)
 *   --file <path>      Single file to translate
 *   --target <lang>    Target language code (e.g., 'en', 'pt', 'es'; default: 'en')
 *   --out-dir <path>   Output directory for translated files
 *   --in-place         Overwrite source files directly
 *   --dry-run          Preview files to be translated without modifying filesystem
 *   --json             Output results as a structured JSON object to stdout
 *   --help, -h         Show help text
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dir: 'docs',
    file: null,
    target: 'en',
    outDir: null,
    inPlace: false,
    dryRun: false,
    json: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dir' && args[i + 1]) {
      options.dir = args[++i];
    } else if (arg === '--file' && args[i + 1]) {
      options.file = args[++i];
    } else if (arg === '--target' && args[i + 1]) {
      options.target = args[++i];
    } else if (arg === '--out-dir' && args[i + 1]) {
      options.outDir = args[++i];
    } else if (arg === '--in-place') {
      options.inPlace = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  return options;
}

function showHelp() {
  const helpText = `
Markdown Batch Translator

Usage:
  node .agents/skills/doc-translator/scripts/translate-batch.mjs [options]

Options:
  --dir <path>       Directory to scan for .md files (default: docs)
  --file <path>      Single markdown file to translate
  --target <lang>    Target language code ('en', 'pt', 'es', etc. Default: en)
  --out-dir <path>   Output directory for translated files
  --in-place         Translate and overwrite files in-place
  --dry-run          Preview files to be translated without executing writes
  --json             Format summary output as JSON on stdout
  --help, -h         Show this help message

Exit Codes:
  0: Success / Dry-run completed cleanly
  1: Invalid arguments or missing input path
  2: Translation execution error
`;
  console.log(helpText.trim());
}

function logDiagnostic(msg, isJson = false) {
  if (!isJson) {
    process.stderr.write(`${msg}\n`);
  }
}

function protectMarkdown(content) {
  const placeholders = [];

  function addPlaceholder(text) {
    const key = `__PROTECTED_BLOCK_${placeholders.length}__`;
    placeholders.push({ key, text });
    return key;
  }

  let processed = content;

  // 1. Protect YAML Frontmatter
  processed = processed.replace(/^---[\s\S]*?---/g, (match) => addPlaceholder(match));

  // 2. Protect Code Blocks (``` ... ```)
  processed = processed.replace(/```[\s\S]*?```/g, (match) => addPlaceholder(match));

  // 3. Protect Inline Code (`...`)
  processed = processed.replace(/`[^`\n]+`/g, (match) => addPlaceholder(match));

  // 4. Protect Markdown URLs in links [text](url) -> [text](__PROTECTED_BLOCK_X__)
  processed = processed.replace(/(\[[^\]]+\])\(([^)]+)\)/g, (match, text, url) => {
    const urlKey = addPlaceholder(url);
    return `${text}(${urlKey})`;
  });

  return { processed, placeholders };
}

function restoreMarkdown(content, placeholders) {
  let restored = content;
  for (let i = placeholders.length - 1; i >= 0; i--) {
    const { key, text } = placeholders[i];
    restored = restored.replaceAll(key, text);
  }
  return restored;
}

async function translateText(text, targetLang) {
  if (!text.trim()) return text;

  const lines = text.split('\n');
  const translatedLines = [];

  for (const line of lines) {
    if (!line.trim() || line.startsWith('__PROTECTED_BLOCK_')) {
      translatedLines.push(line);
      continue;
    }

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(line)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const translatedSegment = json[0]?.map((item) => item[0]).join('') || line;
        translatedLines.push(translatedSegment);
      } else {
        translatedLines.push(line);
      }
    } catch {
      translatedLines.push(line);
    }
  }

  return translatedLines.join('\n');
}

async function processFile(filePath, options) {
  logDiagnostic(`Processing: ${filePath}`, options.json);
  const rawContent = fs.readFileSync(filePath, 'utf-8');

  let outputPath = filePath;
  if (options.outDir) {
    const baseDir = options.dir ? path.resolve(options.dir) : process.cwd();
    const relative = path.relative(baseDir, filePath);
    outputPath = path.join(options.outDir, relative);
  } else if (!options.inPlace) {
    const ext = path.extname(filePath);
    const base = filePath.slice(0, -ext.length);
    outputPath = `${base}.${options.target}${ext}`;
  }

  if (options.dryRun) {
    logDiagnostic(`[Dry-Run] Would translate '${filePath}' -> '${outputPath}'`, options.json);
    return { input: filePath, output: outputPath, bytes: rawContent.length, status: 'dry_run' };
  }

  const { processed, placeholders } = protectMarkdown(rawContent);
  const translatedText = await translateText(processed, options.target);
  const finalContent = restoreMarkdown(translatedText, placeholders);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, finalContent, 'utf-8');
  logDiagnostic(`Saved: ${outputPath}`, options.json);

  return { input: filePath, output: outputPath, bytes: finalContent.length, status: 'success' };
}

function findMarkdownFiles(dirPath, ignoreDir = null) {
  const results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (ignoreDir && path.resolve(fullPath).toLowerCase() === path.resolve(ignoreDir).toLowerCase()) {
      continue;
    }
    if (entry.isDirectory()) {
      if (entry.name === 'translations') continue;
      results.push(...findMarkdownFiles(fullPath, ignoreDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  let filesToProcess = [];

  if (options.file) {
    const absPath = path.resolve(options.file);
    if (fs.existsSync(absPath)) {
      filesToProcess.push(absPath);
    } else {
      process.stderr.write(`Error: File not found '${options.file}'. Check path and try again.\n`);
      process.exit(1);
    }
  } else {
    const absDir = path.resolve(options.dir);
    if (!fs.existsSync(absDir)) {
      process.stderr.write(`Error: Directory not found '${options.dir}'. Check path and try again.\n`);
      process.exit(1);
    }
    const ignoreDir = options.outDir ? path.resolve(options.outDir) : null;
    filesToProcess = findMarkdownFiles(absDir, ignoreDir);
  }

  if (filesToProcess.length === 0) {
    logDiagnostic('No markdown files found to process.', options.json);
    if (options.json) {
      console.log(JSON.stringify({ status: 'success', count: 0, files: [] }));
    }
    process.exit(0);
  }

  logDiagnostic(`Found ${filesToProcess.length} markdown file(s) for batch translation to '${options.target}'.`, options.json);

  const results = [];
  for (const file of filesToProcess) {
    try {
      const res = await processFile(file, options);
      results.push(res);
    } catch (err) {
      process.stderr.write(`Error processing '${file}': ${err.message}\n`);
      results.push({ input: file, status: 'error', error: err.message });
    }
  }

  if (options.json) {
    console.log(JSON.stringify({
      status: options.dryRun ? 'dry_run' : 'completed',
      target_language: options.target,
      total_files: filesToProcess.length,
      results,
    }, null, 2));
  } else {
    logDiagnostic(`Batch translation ${options.dryRun ? 'dry-run ' : ''}complete. Processed ${results.length} file(s).`, false);
  }

  process.exit(0);
}

main().catch((err) => {
  process.stderr.write(`Fatal error during batch translation: ${err.message}\n`);
  process.exit(2);
});
