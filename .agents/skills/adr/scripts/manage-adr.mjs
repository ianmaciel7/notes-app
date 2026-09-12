#!/usr/bin/env node

/**
 * ADR Management and Synchronization Script for notes-app
 * 
 * Usage:
 *   node .agents/skills/adr/scripts/manage-adr.mjs [command] [args]
 * 
 * Commands:
 *   list               List all existing ADRs with status, date, and paths
 *   new "<title>"      Create a new sequential ADR from the MADR template and sync indexes
 *   sync               Regenerate index tables in docs/decisions/README.md and DECISIONS.md
 *   validate           Validate numbering, required fields, and path portability
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Workspace root is 4 levels up from this script: .agents/skills/adr/scripts
const WORKSPACE_ROOT = path.resolve(__dirname, '../../../../');
const DECISIONS_DIR = path.join(WORKSPACE_ROOT, 'docs', 'decisions');
const DECISIONS_INDEX_FILE = path.join(WORKSPACE_ROOT, 'DECISIONS.md');
const DECISIONS_README_FILE = path.join(DECISIONS_DIR, 'README.md');
const TEMPLATE_FILE = path.resolve(__dirname, '../templates/madr-template.md');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseAdrFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  const numMatch = filename.match(/^(\d{4})-(.*)\.md$/);
  if (!numMatch) return null;

  const idNum = numMatch[1];
  const slug = numMatch[2];

  // Match title in header # ADR-XXXX: Title
  const titleMatch = content.match(/^#\s+(?:ADR-\d{4}:\s*)?(.*)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug;

  // Match Status
  const statusMatch = content.match(/\*\s+\*\*Status\*\*:\s*([^\n\r]+)/i);
  const status = statusMatch ? statusMatch[1].trim() : 'Unknown';

  // Match Date
  const dateMatch = content.match(/\*\s+\*\*Date\*\*:\s*([^\n\r]+)/i);
  const date = dateMatch ? dateMatch[1].trim() : 'Unknown';

  // Match Deciders
  const decidersMatch = content.match(/\*\s+\*\*Deciders\*\*:\s*([^\n\r]+)/i);
  const deciders = decidersMatch ? decidersMatch[1].trim() : 'Unknown';

  return {
    idNum,
    id: `ADR-${idNum}`,
    title,
    status,
    date,
    deciders,
    filename,
    filePath,
    content
  };
}

function getAdrs() {
  if (!fs.existsSync(DECISIONS_DIR)) {
    fs.mkdirSync(DECISIONS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(DECISIONS_DIR);
  const adrs = [];

  for (const file of files) {
    if (/^\d{4}-.*\.md$/.test(file)) {
      const parsed = parseAdrFile(path.join(DECISIONS_DIR, file));
      if (parsed) {
        adrs.push(parsed);
      }
    }
  }

  adrs.sort((a, b) => parseInt(a.idNum, 10) - parseInt(b.idNum, 10));
  return adrs;
}

function listAdrs() {
  const adrs = getAdrs();
  console.log(`\nFound ${adrs.length} Architectural Decision Records:\n`);
  console.log('| ID | Title | Status | Date | File |');
  console.log('| --- | --- | --- | --- | --- |');
  for (const adr of adrs) {
    console.log(`| ${adr.id} | ${adr.title} | ${adr.status} | ${adr.date} | docs/decisions/${adr.filename} |`);
  }
  console.log('');
}

function syncIndexes() {
  const adrs = getAdrs();

  // 1. Generate docs/decisions/README.md
  let readmeContent = `# Architectural Decision Log (MADR)\n\n`;
  readmeContent += `All architectural decisions for \`notes-app\` are documented here using the [MADR (Markdown Architectural Decision Records)](https://adr.github.io/madr/) format.\n\n`;
  readmeContent += `---\n\n`;
  readmeContent += `## Index of Architectural Decision Records (ADRs)\n\n`;
  readmeContent += `| ID | Title | Status | Date |\n`;
  readmeContent += `| --- | --- | --- | --- |\n`;

  for (const adr of adrs) {
    readmeContent += `| [${adr.id}](${adr.filename}) | ${adr.title} | ${adr.status} | ${adr.date} |\n`;
  }
  readmeContent += `\n`;

  fs.writeFileSync(DECISIONS_README_FILE, readmeContent, 'utf8');
  console.log(`✓ Synchronized ${path.relative(WORKSPACE_ROOT, DECISIONS_README_FILE)}`);

  // 2. Generate root DECISIONS.md
  let rootContent = `# Architectural Decision Log (MADR)\n\n`;
  rootContent += `> **Note**: Architectural Decision Records (ADRs) are organized under [\`docs/decisions/\`](docs/decisions/README.md).\n\n`;
  rootContent += `All architectural decisions for \`notes-app\` are documented here using the [MADR (Markdown Architectural Decision Records)](https://adr.github.io/madr/) format.\n\n`;
  rootContent += `---\n\n`;
  rootContent += `## Index of Architectural Decision Records (ADRs)\n\n`;
  rootContent += `| ID | Title | Status | Date |\n`;
  rootContent += `| --- | --- | --- | --- |\n`;

  for (const adr of adrs) {
    const anchor = slugify(`${adr.id} ${adr.title}`);
    rootContent += `| [${adr.id}](#${anchor}) | ${adr.title} | ${adr.status} | ${adr.date} |\n`;
  }

  for (const adr of adrs) {
    rootContent += `\n---\n\n`;
    // Demote h1 `# ADR-...` to h2 `## ADR-...` and h2 `## Section` to h3 `### Section`
    let adaptedContent = adr.content
      .replace(/^### /gm, '#### ')
      .replace(/^## /gm, '### ')
      .replace(/^# /gm, '## ');
    
    rootContent += `${adaptedContent.trim()}\n`;
  }

  fs.writeFileSync(DECISIONS_INDEX_FILE, rootContent, 'utf8');
  console.log(`✓ Synchronized ${path.relative(WORKSPACE_ROOT, DECISIONS_INDEX_FILE)}`);
}

function createAdr(title) {
  if (!title || !title.trim()) {
    console.error('Error: ADR title is required. Example: node manage-adr.mjs new "Local First Storage"');
    process.exit(1);
  }

  const cleanTitle = title.trim();
  const slug = slugify(cleanTitle);
  const adrs = getAdrs();

  let nextNum = 1;
  if (adrs.length > 0) {
    const highest = Math.max(...adrs.map(a => parseInt(a.idNum, 10)));
    nextNum = highest + 1;
  }

  const idNum = String(nextNum).padStart(4, '0');
  const filename = `${idNum}-${slug}.md`;
  const targetPath = path.join(DECISIONS_DIR, filename);

  if (fs.existsSync(targetPath)) {
    console.error(`Error: File ${targetPath} already exists.`);
    process.exit(1);
  }

  const today = new Date().toISOString().split('T')[0];
  let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

  template = template
    .replace(/\{\{ID\}\}/g, idNum)
    .replace(/\{\{TITLE\}\}/g, cleanTitle)
    .replace(/\{\{STATUS\}\}/g, 'Proposed')
    .replace(/\{\{DECIDERS\}\}/g, 'Engineering & Product Team')
    .replace(/\{\{DATE\}\}/g, today)
    .replace(/\{\{CONTEXT\}\}/g, `Provide context and motivation for ${cleanTitle}.`)
    .replace(/\{\{DRIVER_1\}\}/g, 'Performance and offline responsiveness')
    .replace(/\{\{DRIVER_2\}\}/g, 'Clean architecture and maintainability')
    .replace(/\{\{OPTION_1\}\}/g, 'Selected Option')
    .replace(/\{\{OPTION_1_DESC\}\}/g, 'Description of option 1')
    .replace(/\{\{OPTION_2\}\}/g, 'Alternative Option')
    .replace(/\{\{OPTION_2_DESC\}\}/g, 'Description of option 2')
    .replace(/\{\{CHOSEN_OPTION\}\}/g, 'Selected Option')
    .replace(/\{\{JUSTIFICATION\}\}/g, 'it best aligns with the decision drivers')
    .replace(/\{\{POSITIVE_CONSEQUENCE_1\}\}/g, 'Solves the primary problem statement')
    .replace(/\{\{POSITIVE_CONSEQUENCE_2\}\}/g, 'Clear boundaries and maintainable code')
    .replace(/\{\{NEGATIVE_CONSEQUENCE_1\}\}/g, 'Requires initial implementation effort')
    .replace(/\{\{PRO_1\}\}/g, 'simple and reliable')
    .replace(/\{\{CON_1\}\}/g, 'slight learning curve')
    .replace(/\{\{PRO_2\}\}/g, 'familiar to team')
    .replace(/\{\{CON_2\}\}/g, 'insufficient scalability')
    .replace(/\{\{REJECTION_REASON_2\}\}/g, 'does not fulfill the latency and offline persistence requirements');

  fs.writeFileSync(targetPath, template, 'utf8');
  console.log(`\n✓ Created new ADR: ${path.relative(WORKSPACE_ROOT, targetPath)}`);

  syncIndexes();
  console.log(`\nNext steps:`);
  console.log(`1. Edit docs/decisions/${filename} with your rationale and trade-offs.`);
  console.log(`2. Run 'node .agents/skills/adr/scripts/manage-adr.mjs sync' after editing.`);
  console.log(`3. Run 'graphify update .' to keep the knowledge graph synchronized.\n`);
}

function validateAdrs() {
  const adrs = getAdrs();
  console.log(`\nValidating ${adrs.length} ADRs...`);
  let errors = 0;
  let warnings = 0;

  // 1. Check sequential numbering
  for (let i = 0; i < adrs.length; i++) {
    const expected = i + 1;
    const actual = parseInt(adrs[i].idNum, 10);
    if (actual !== expected) {
      console.error(`✖ Sequence gap: expected ADR-${String(expected).padStart(4, '0')}, found ADR-${adrs[i].idNum}`);
      errors++;
    }
  }

  // 2. Check each file structure and portable paths
  for (const adr of adrs) {
    const content = adr.content;
    const relPath = path.relative(WORKSPACE_ROOT, adr.filePath);

    if (adr.title === adr.filename || !adr.title) {
      console.warn(`⚠ ${relPath}: Title heading missing or invalid.`);
      warnings++;
    }

    const validStatuses = ['proposed', 'accepted', 'rejected', 'superseded', 'deprecated'];
    const statusNormalized = adr.status.toLowerCase();
    const isValidStatus = validStatuses.some(s => statusNormalized.startsWith(s));

    if (!isValidStatus) {
      console.warn(`⚠ ${relPath}: Non-standard status "${adr.status}".`);
      warnings++;
    }

    // Check absolute user paths (e.g. C:\Users or /Users/)
    if (/[C-Z]:\\Users\\/i.test(content) || /\/Users\/[a-zA-Z0-9_-]+/i.test(content) || /\/home\/[a-zA-Z0-9_-]+/i.test(content)) {
      console.error(`✖ ${relPath}: Non-portable absolute user path detected.`);
      errors++;
    }
  }

  if (errors === 0 && warnings === 0) {
    console.log(`✓ All ADRs passed validation with zero errors or warnings.\n`);
  } else {
    console.log(`\nValidation finished with ${errors} error(s) and ${warnings} warning(s).\n`);
    if (errors > 0) process.exit(1);
  }
}

function printHelp() {
  console.log(`
ADR Management CLI for notes-app

Usage:
  node .agents/skills/adr/scripts/manage-adr.mjs <command> [args]

Commands:
  list              List all ADRs with status and paths
  new "<title>"     Create a new sequential ADR from template and sync index
  sync              Synchronize docs/decisions/README.md and DECISIONS.md
  validate          Verify numbering, required headers, and path portability
  help              Show this help message
`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'list';

  switch (command.toLowerCase()) {
    case 'list':
      listAdrs();
      break;
    case 'new':
    case 'create':
      createAdr(args.slice(1).join(' '));
      break;
    case 'sync':
      syncIndexes();
      break;
    case 'validate':
    case 'check':
      validateAdrs();
      break;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main();
