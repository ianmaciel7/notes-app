---
name: doc-translator
description: Use when translating project documentation, ADRs, architecture specs, README files, or markdown documentation into English (or another specified target language) while preserving formatting and technical integrity.
compatibility: Designed for Node.js environments (requires Node.js 18+ for batch script execution).
metadata:
  category: documentation
  version: "1.0"
---

# Documentation Translator

## Overview

Provide precise guidelines and workflows for translating project documentation, ADRs, architecture specs, and markdown guides into English (or another explicitly requested target language), while preserving original markdown formatting, technical vocabulary, relative links, and code blocks.

## When to Use

Use this skill when:
- Translating non-English documentation, README files, or ADRs into English per repository language rules.
- Translating project guides, design documents, or specifications into a target language requested by the user.
- Auditing repository markdown files for mixed-language text or non-English prose and standardizing them into English.
- Converting external documentation or imported Markdown notes into standard English project docs.

## Translation Guidelines & Invariants

### 1. Default Target Language
- **Default**: Translate to **English** in accordance with the project rule (`AGENTS.md`).
- **User Override**: If the user explicitly requests another target language (e.g., Portuguese, Spanish), follow the requested language.

### 2. What MUST Be Translated
- Paragraph prose, descriptions, and explanatory text.
- Markdown section titles and headings (where standard, e.g. "Overview" -> "Visão Geral" or vice versa).
- Table cell descriptive text.
- GitHub alert callout messages (`[!NOTE]`, `[!WARNING]` body text).

### 3. What MUST NOT Be Translated (Preserve Verbatim)
- **Code Blocks & Identifiers**: Code snippets, function names, variable names, types, imports, and shell commands.
- **File Paths & URLs**: Relative paths (e.g., `docs/decisions/0001-baseline.md`), absolute URIs, and `file:///` links.
- **Frontmatter Keys**: YAML metadata keys (`name`, `description`, `status`, `date`).
- **Mermaid Diagram Structure**: Node IDs and diagram syntax (`flowchart TD`, `subgraph`, arrows). Only human-readable labels may be translated.
- **Domain Acronyms & Standard Terms**: Keep PKM and technical acronyms intact (e.g., `ADR`, `MADR`, `FSRS`, `RSC`, `Zod`, `App Router`).

## Core Translation Workflow

1. **Read Source File**: View the full source document to understand domain context and terminology.
2. **Translate Content**: Translate descriptive text while keeping all markdown syntax, code fences, inline code, and links identical.
3. **Verify Links & Code**: Ensure no relative links (`[title](path/file.md)`), anchors (`#heading`), or code blocks were broken or modified.
4. **Graphify Sync**: Run `graphify update .` if structural doc nodes were modified.

## Available Scripts

- **`scripts/translate-batch.mjs`** - Executable batch translation script. Protects markdown AST (frontmatter, code blocks, links, and inline code) during translation.

### Automated Batch Translation Tool

Use the included Node.js script [`scripts/translate-batch.mjs`](scripts/translate-batch.mjs) to run batch translation on markdown files under `docs/` or any specified directory.

```bash
# Preview files to be translated without writing changes (Dry-Run)
node .agents/skills/doc-translator/scripts/translate-batch.mjs --dir docs --target en --dry-run --json

# Translate all markdown files in docs/ to English
node .agents/skills/doc-translator/scripts/translate-batch.mjs --dir docs --target en

# Batch translate docs/ to Portuguese in a separate output directory
node .agents/skills/doc-translator/scripts/translate-batch.mjs --dir docs --target pt --out-dir docs/translations/pt

# Translate a single markdown file in-place
node .agents/skills/doc-translator/scripts/translate-batch.mjs --file docs/architecture/README.md --target en --in-place
```

## Common Mistakes & Red Flags

| Red Flag / Anti-Pattern | Correct Practice |
| :--- | :--- |
| Translating code snippets, CLI commands, or variable names | Keep all code, command strings, and code fences untranslated. |
| Translating file paths or URL anchors in markdown links | Preserve all file paths, relative links, and anchor tags verbatim. |
| Translating YAML frontmatter keys in markdown files | Only translate values if they contain human prose (do not alter keys). |
| Altering Mermaid flowchart structure or node identifiers | Leave node keys and diagram control flow unchanged; only translate visible label strings. |
