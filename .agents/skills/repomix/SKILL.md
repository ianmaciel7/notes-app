---
name: repomix
description: Pack repository codebases into single AI-friendly files using Repomix. Use when preparing broad repository snapshots, configuring repomix.config.json, analyzing token counts, setting up custom ignore patterns, or troubleshooting repomix CLI commands.
---

# Repomix Skill

Repomix (formerly Repopack) packs your entire repository or targeted directories into a single, structured file (XML, Markdown, or Plain Text) optimized for Large Language Models (LLMs) and coding agents.

In this repository, [`repomix.config.json`](../../repomix.config.json) is the canonical configuration, and [`AGENTS.md`](../../AGENTS.md) mandates using Repomix whenever a broad, portable repository snapshot is needed.

## When to Use This Skill

- When creating or refreshing a repository snapshot for AI analysis.
- When configuring or auditing [`repomix.config.json`](../../repomix.config.json).
- When filtering files with `.repomixignore` or custom security patterns.
- When generating compressed outputs for large codebases.

## CLI Usage (Always prefix with RTK in agent workflows)

```powershell
# Standard local repository pack using repomix.config.json
rtk repomix

# Pack specific directory
rtk repomix src

# Output to custom path with specific style
rtk repomix -o output.xml --style xml

# Pack with compression for large outputs
rtk repomix --compress

# Pipe output to stdout
rtk repomix --stdout

# Check token count using specific tokenizer encoding
rtk repomix --token-count-encoding o200k_base
```

## Configuration Reference (`repomix.config.json`)

The project uses the following canonical structure:

```json
{
  "$schema": "https://repomix.com/schemas/latest/schema.json",
  "input": {
    "maxFileSize": 50000000
  },
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "filePathStyle": "target-relative",
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "showLineNumbers": false
  },
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": [
      "repomix-output.*",
      ".env*",
      "**/*.pem",
      "**/*.key"
    ]
  },
  "security": {
    "enableSecurityCheck": true
  }
}
```

## Security Best Practices

1. **Security Scanning**: Always leave `"enableSecurityCheck": true` enabled to prevent secrets/keys from leaking into prompt context.
2. **Sensitive Files**: Ensure all credential, certificate, and secret files (`.env*`, `*.pem`, `*.key`) are included in `customPatterns` or `.repomixignore`.
3. **Artifact Isolation**: `repomix-output.*` is git-ignored and must never be committed to source control.
4. **Pattern Precedence**: Custom config patterns take highest precedence, followed by `.repomixignore` / `.gitignore`, and finally default patterns (`node_modules/**`, `.git/**`, `coverage/**`, `dist/**`).
