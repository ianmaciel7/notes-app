<!-- BEGIN:agent-skills-rules -->

# Agent Skills Authoring & Architecture Rules

This policy defines the required structure, frontmatter specification, script design principles, and evaluation standards for creating and maintaining Agent Skills in `.agents/skills/`.

---

## 1. Directory Structure Standards

Every skill in `.agents/skills/` MUST follow this canonical directory layout:

```text
.agents/skills/<skill-name>/
├── SKILL.md                  # REQUIRED: YAML frontmatter + core instructions (< 500 lines)
├── scripts/                  # OPTIONAL: Executable tools (Node.js, Python, Shell)
├── references/               # OPTIONAL: Heavy technical reference docs (> 100 lines)
├── assets/                   # OPTIONAL: Static templates, JSON schemas, lookup tables
└── evals/                    # OPTIONAL: Test cases & assertions (evals.json)
```

---

## 2. SKILL.md Frontmatter Specification

`SKILL.md` MUST begin with valid YAML frontmatter adhering to the official specification:

```yaml
---
name: <skill-name>
description: >
  Use when [specific triggering conditions, symptoms, and user intent].
compatibility: Designed for Node.js / Python environments (specify runtime requirements).
metadata:
  category: <category-name>
  version: "1.0"
---
```

### Validation Rules:
1. **`name` (Required)**:
   - Must be 1 to 64 characters.
   - Unicode lowercase alphanumeric characters (`a-z`, `0-9`) and hyphens (`-`) only.
   - Must NOT start or end with a hyphen (`-`).
   - Must NOT contain consecutive hyphens (`--`).
   - **MUST EXACTLY MATCH the parent directory name** (`.agents/skills/<skill-name>`).
2. **`description` (Required)**:
   - Must be 1 to 1024 characters.
   - Written in third person, starting with `"Use when..."`.
   - **Focus strictly on triggering conditions and user intent**. Do NOT summarize internal workflows or steps (prevents shortcutting).
3. **`compatibility` (Optional)**:
   - Max 500 characters. State environment or system package dependencies (e.g. Node.js 18+, Python 3.12+).
4. **`metadata` (Optional)**:
   - Key-value string map for versioning, category, or authoring tags.

---

## 3. Progressive Disclosure & Context Budget

- **Context Ceiling**: Keep `SKILL.md` under 500 lines (~5,000 tokens).
- **Reference Offloading**: Move API references, schemas, or extensive documentation (> 100 lines) into `references/<filename>.md`.
- **Relative Path References**: Always use relative paths from skill root (`scripts/tool.mjs`, `references/guide.md`).

---

## 4. Agentic Script Design (`scripts/`)

All bundled scripts in `scripts/` MUST be designed for non-interactive agentic execution:

1. **Non-Interactive Execution**: Never block on TTY prompts, input dialogs, or confirmation menus. Accept parameters via `--flags`, environment variables, or stdin.
2. **`--help` Documentation**: Include a comprehensive `--help` flag detailing usage, options, and examples.
3. **Structured Output (`--json`)**: Support `--json` output on `stdout` for clean machine parsing.
4. **Diagnostic Separation (`stderr`)**: Send log messages, warnings, and diagnostic progress to `stderr`.
5. **Dry-Run Support (`--dry-run`)**: Provide `--dry-run` for stateful or filesystem-modifying operations.
6. **Explicit Exit Codes**:
   - `0`: Success or clean dry-run preview.
   - `1`: Invalid arguments or missing input path.
   - `2`: Processing or runtime failure.
7. **Markdown AST Protection**: When parsing Markdown, explicitly protect frontmatter (`---`), code blocks (```), inline backticks (` ` `), and link URLs.

---

## 5. Evaluation & Test Suite (`evals/evals.json`)

To ensure skill output quality and avoid regression, include test cases in `evals/evals.json`:

```json
{
  "skill_name": "<skill-name>",
  "evals": [
    {
      "id": 1,
      "prompt": "<Realistic user prompt>",
      "expected_output": "<Human-readable description of success>",
      "files": ["path/to/test/file.md"],
      "assertions": [
        "Verifiable assertion 1 (e.g., Code blocks remain untranslated)",
        "Verifiable assertion 2 (e.g., Script completes with exit code 0)"
      ]
    }
  ]
}
```

<!-- END:agent-skills-rules -->
