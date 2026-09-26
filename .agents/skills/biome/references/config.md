# Biome Configuration Reference

## `biome.json` Full Schema (Annotated)

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.4.2/schema.json",

  // VCS integration — respects .gitignore when useIgnoreFile is true
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },

  // File scanning scope
  "files": {
    "ignoreUnknown": true,         // skip files Biome can't parse
    "includes": [
      "**",                         // scan everything
      "!node_modules",              // exclude (soft)
      "!.next",
      "!dist",
      "!build",
      "!coverage",
      // Force-ignore (!! prefix) = unconditionally skip even if other rules include them:
      // "!!src/components/ui/**"   // example: exclude generated shadcn files
    ]
  },

  // Formatter settings
  "formatter": {
    "enabled": true,
    "indentStyle": "space",        // "space" | "tab"
    "indentWidth": 2
  },

  // CSS-specific parser settings
  "css": {
    "parser": {
      "tailwindDirectives": true   // allow @apply, @tailwind, etc.
    }
  },

  // Linter settings
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,         // enable all recommended rules

      // Per-group rule overrides:
      "complexity": {
        "noExcessiveCognitiveComplexity": {
          "level": "error",
          "options": { "maxAllowedComplexity": 15 }
        }
      }
      // Add more groups here: a11y, correctness, style, suspicious, etc.
    },

    // Domain-specific rule sets
    "domains": {
      "next": "recommended",       // Next.js best practices
      "react": "recommended"       // React hooks + patterns
    }
  },

  // Assist actions (applied on --write)
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"    // sort/organize imports automatically
      }
    }
  },

  // Per-path overrides (applied after global config)
  "overrides": [
    // Example: relax a11y rules for shadcn/ui generated components
    // {
    //   "includes": ["src/components/ui/**"],
    //   "linter": {
    //     "rules": {
    //       "a11y": { "recommended": "off" }
    //     }
    //   }
    // },

    // Example: allow CJS patterns in agent scripts
    // {
    //   "includes": [".agents/**/*.js"],
    //   "linter": {
    //     "rules": {
    //       "suspicious": { "noRedundantUseStrict": "off" }
    //     }
    //   }
    // }
  ]
}
```

---

## Key `files.includes` Patterns

| Pattern | Effect |
|---|---|
| `"**"` | Include everything |
| `"!node_modules"` | Soft-exclude (can be re-included by other patterns) |
| `"!!src/generated/**"` | Force-exclude — never scanned, no matter what |
| `"src/**/*.ts"` | Include only TypeScript files in src |

> The `!!` force-ignore prefix is the Biome 2.x replacement for `experimentalScannerIgnores` (deprecated).

---

## Overrides Structure

Overrides apply in order — later entries take precedence:

```jsonc
{
  "overrides": [
    {
      "includes": ["glob/pattern/**"],
      "linter": {
        "rules": {
          "groupName": {
            "ruleName": "off"      // "off" | "warn" | "error" | { "level": "...", "fix": "..." }
          }
        }
      },
      "formatter": {
        "indentWidth": 4           // different indentation for this path
      }
    }
  ]
}
```

---

## CLI Reference

```bash
# Check (lint + format + organize imports), no writes
biome check [paths]

# Apply safe fixes
biome check --write [paths]

# Apply safe + unsafe fixes
biome check --write --unsafe [paths]

# Lint only
biome lint [paths]
biome lint --write [paths]          # apply safe lint fixes

# Format only
biome format [paths]
biome format --write [paths]

# Show more diagnostics (default is 20)
biome check --max-diagnostics=200 [paths]

# Initialize a new biome.json
biome init
```

---

## Domains

Domains are curated rule sets for frameworks. In this project:

| Domain | Value | What it enables |
|---|---|---|
| `react` | `recommended` | Hooks exhaustive deps, no array index key, React-specific a11y |
| `next` | `recommended` | Next.js `<Image>` usage, `<Link>` patterns, metadata conventions |

To disable a domain:
```jsonc
{ "linter": { "domains": { "react": "off" } } }
```
