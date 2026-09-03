---
trigger: always_on
description: Policy requiring all repository-facing artifacts, rules, documentation, commit messages, and code to be written in English.
---

# English-First Policy

Always use English for repository-facing and code-facing artifacts, including:
- Agent rules, skills, and system prompts
- Pull request titles, descriptions, and summaries
- Markdown documentation, specifications, and architecture decisions
- Commit messages and changelogs
- Variable names, function names, type definitions, comments, and public APIs

Reasoning:
- Consistency with automated CI, tooling, linters, and long-term codebase maintainability.
- If user input or external prompts arrive in another language, translate the intent into English in all repository artifacts.
