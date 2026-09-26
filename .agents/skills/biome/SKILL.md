---
name: biome
description: >
  Run, configure, and fix Biome (linter + formatter) for this project. Use this skill
  whenever the user mentions "biome", "lint", "lint fix", "format", "pnpm lint", "biome check",
  "biome.json", linting errors, auto-fix, safe/unsafe fixes, linter rules, or code style issues.
  Also activate when the user asks to add a rule, ignore a file/directory, configure overrides,
  or understand why a lint error appeared. Triggers on: "run lint", "fix lint", "biome config",
  "suppress this rule", "ignore this file in biome", "format with biome", "apply safe fixes".
---

# Biome Skill

This project uses [Biome](https://biomejs.dev) as its all-in-one linter + formatter (configured in [`biome.json`](../../../biome.json)).  
Biome runs formatting, linting, and import organization in a single pass via `biome check`.

> Read [`references/rules.md`](references/rules.md) when diagnosing specific lint rules.  
> Read [`references/config.md`](references/config.md) when modifying `biome.json` or adding overrides.

---

## Project Scripts

| Intent | Command |
|---|---|
| Check all (no write) | `pnpm lint` → `biome check` |
| Apply **safe** fixes | `pnpm biome check --write` |
| Apply **safe + unsafe** fixes | `pnpm biome check --write --unsafe` |
| Format only | `pnpm format` → `biome format --write` |
| Check specific paths | `pnpm biome check --write src/ scripts/` |
| Increase diagnostic output | `pnpm biome check --max-diagnostics=200` |

> **`pnpm lint`** (`biome check` with no args) runs on the full project root.
> Passing extra words after it (e.g. `pnpm lint fix`) treats them as **file paths**, not subcommands — this is a common mistake.

---

## Fix Workflow

### 1. Run safe-only fixes first

```bash
pnpm biome check --write src/ scripts/ .agents/
```

Safe fixes are semantics-preserving and can be applied automatically. They include:
- Removing redundant `"use strict"` directives
- Adding `node:` protocol to Node.js `require()` calls
- Removing redundant ARIA roles (e.g. `role="navigation"` on `<nav>`)
- Removing unused imports
- Organizing imports

### 2. Review remaining errors by category

After safe fixes, remaining diagnostics typically fall into:

| Category | Typical location | Strategy |
|---|---|---|
| `a11y/*` (accessibility) | `src/components/ui/` (shadcn) | Ignore via `biome-ignore` or `overrides` — these are generated files |
| `correctness/useExhaustiveDependencies` | React hooks | Evaluate if the dep is truly stable (e.g. `setState` from `useState`) |
| `suspicious/noArrayIndexKey` | `.map((item, index) =>` | Fix by using a stable ID; only safe to index-key when list is static |
| `lint/suspicious/noAssignInExpressions` | `while ((match = re.exec(text))` | Refactor to use a `for...of` or pre-assign |

### 3. Apply unsafe fixes selectively

```bash
# Only when you understand the implication:
pnpm biome check --write --unsafe src/specific-file.tsx
```

Unsafe fixes may change semantics (e.g. renaming an unused variable to `_name`). Review the diff before committing.

---

## Ignoring Files and Directories

### Via `biome.json` `files.includes`

Exclude paths globally (force-ignore syntax with `!!` prefix):

```json
{
  "files": {
    "includes": ["**", "!node_modules", "!!src/components/ui/**"]
  }
}
```

> The `!!` prefix is the **force-ignore** syntax in Biome 2.x — use it for generated files you never want touched.

### Via `overrides` (per-rule, per-path)

Disable specific rules for generated/vendor paths without excluding the whole file from formatting:

```jsonc
{
  "overrides": [
    {
      "includes": ["src/components/ui/**"],
      "linter": {
        "rules": {
          "a11y": { "recommended": "off" },
          "correctness": { "useExhaustiveDependencies": "off" }
        }
      }
    }
  ]
}
```

### Via inline suppress comment

Suppress a single line or block:

```ts
// biome-ignore lint/suspicious/noArrayIndexKey: static list, order never changes
<li key={index}>{item}</li>
```

---

## Configuring Fix Severity

Override whether a fix is treated as safe or unsafe per-rule:

```jsonc
{
  "linter": {
    "rules": {
      "correctness": {
        "noUnusedVariables": {
          "level": "error",
          "fix": "none"          // disable auto-fix entirely
        }
      },
      "style": {
        "useConst": {
          "level": "warn",
          "fix": "unsafe"        // opt-in to unsafe fix for this rule
        }
      }
    }
  }
}
```

---

## This Project's `biome.json` Key Settings

- **VCS integration** (`vcs.useIgnoreFile: true`) — respects `.gitignore`
- **Formatter**: spaces, indent width 2
- **Domains**: `next: recommended`, `react: recommended`
- **Assist**: `organizeImports: on`
- **Recommended rules**: enabled globally

---

## Common Pitfalls

- `pnpm lint fix` → **wrong** — treats `fix` as a path. Use `pnpm biome check --write` instead.
- `biome check --write --unsafe` on generated `src/components/ui/` → **avoid** — shadcn components should be regenerated from their registry, not hand-edited.
- Running `biome check .` picks up `.agents/` scripts — these are CJS CommonJS files; Biome may panic on empty-shebang files. Use path scoping or `overrides` to handle them.
- Biome internal panics (`internalError/panic`) on `.agents/skills/context-manager/scripts/` files are a known upstream issue with certain CJS patterns — add them to a `biome-ignore` override or exclude them from the scan.
