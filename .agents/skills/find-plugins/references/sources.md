# Discovery Sources

Search sources in the order below. Searching a source does not imply trusting it.

For every query, route through official vendor sources first:
1. official vendor CLI with documented read-only discovery;
2. official vendor marketplace or directory;
3. official vendor documentation;
4. public read-only metadata from the official vendor.

Use policy-permitted community metadata only after official sources have been attempted, or when the user explicitly asks for community discovery.

Never run community discovery or plugin-manager CLIs. Never install, enable, disable, uninstall, download, clone, or execute anything during discovery.

## Tier A - Official platform sources

### OpenAI / Codex
- Official Codex CLI plugin browser, if available and documented read-only: `codex` then `/plugins`
- Official ChatGPT/Codex plugin directory or current official plugin surface
- Official OpenAI developer documentation
- Official OpenAI repositories when directly relevant

### Anthropic / Claude Code
- Official Claude Code plugin discovery, if available and documented read-only: `claude`, `/plugin`, `Discover`
- Official Claude Code plugin marketplace / built-in marketplace discovery
- `claude-plugins-official` when current official documentation exposes it
- Official Anthropic documentation
- Official Anthropic repositories

### Cursor
- Cursor Marketplace
- Cursor Customize Plugins interface
- Official Cursor plugin documentation
- Publisher verification shown by Cursor

Do not invent or run `cursor plugin search` unless current official Cursor documentation explicitly documents it as read-only.

### Google Gemini CLI
- Official Gemini CLI extension discovery, if available and documented read-only: `/extension explore`
- Gemini CLI Extensions Gallery
- Official Gemini CLI extension documentation
- Google-maintained repositories linked by the official gallery

Installed extensions may be inspected with documented read-only commands such as `gemini extensions list`, but installed-extension listing is not marketplace search.

### Google Antigravity
- Official Antigravity CLI installed-plugin inspection, if documented read-only: `agy plugin list`
- Official Antigravity plugin documentation and plugin surfaces
- Official Antigravity CLI plugin documentation
- Google-maintained integration repositories referenced by Antigravity

Do not run `agy plugin install`, `agy plugin enable`, `agy plugin disable`, or `agy plugin uninstall` during discovery. Do not invent `agy plugin search` unless Google officially introduces and documents it.

### Agent Plugins standard
- `agent-plugins.org` for the current specification/schema
- Original vendor/publisher sources for actual plugins

The specification is a compatibility reference, not proof of trust.

### MCP
When no suitable native plugin exists, search the current official MCP registry if available.
Label the result `MCP SERVER`, never `PLUGIN`.

## Tier B - Known cross-platform/community discovery catalogs

Search applicable sources below for broad discovery only when the configured source policy permits community discovery or the user explicitly asks for it. Treat results as non-official until independently verified.

Use these sources through public read-only web metadata only. Do not execute their CLIs, scripts, package-manager commands, installers, or repository code.

### Agent Plugins Directory
- `agentpluginsdirectory.com`

Use for Agent Plugin discovery and schema-conformance signals.
Always follow results to the original source.

### wshobson/agents
- GitHub: `wshobson/agents`

Treat as a community marketplace/catalog unless a candidate is independently first-party.

### 777genius universal plugins
- GitHub: `777genius/universal-plugins-for-ai-agents`

Use as a cross-agent catalog.
Treat entries as community unless independently verified.

### Skill of Skills
- GitHub: `the911fund/skill-of-skills`

Use for discovery across skills, plugins, MCP servers, agents, and integrations.
Verify important results at the original source.
Do not execute Skill of Skills.

### Claude Code Plugins Plus Skills / CCPI catalog
- GitHub: `jeremylongshore/claude-code-plugins-plus-skills`

Use as a Claude-focused community discovery source.
Do not execute or install CCPI.

### cursor.directory
- `cursor.directory`

Community discovery only.
A matching official Cursor Marketplace entry outranks it.

## Tier C - Additional repositories / compatibility references

### plugin-kit-ai
- GitHub: `777genius/plugin-kit-ai`

Use for format/compatibility references and linked catalogs.
Do not treat the toolkit itself as a marketplace unless it currently exposes one.
Do not execute plugin-kit-ai.

### AI Plugin Marketplace
- GitHub: `ai-plugin-marketplace/template`
- GitHub: `ai-plugin-marketplace/tools`

Use as marketplace/format references and for any actual listings they currently expose.
Do not execute AI Plugin Marketplace tooling.

### Glean pluginpack
- GitHub: `gleanwork/pluginpack`

Use for build/adapter/compatibility evidence.
Do not treat it as a general marketplace unless it currently exposes a catalog.
Do not execute pluginpack.

### SkillDock
- GitHub: `wanghuan9/skilldock`

Secondary ecosystem/discovery reference only.
Do not install or run it.

### Open VSX
- `open-vsx.org`

Search only for IDE extensions when relevant.
Label results `IDE EXTENSION`.

### skills.sh
Search only for Agent Skills:
- when no suitable plugin exists; or
- when the user explicitly accepts a Skill alternative.

Label results `AGENT SKILL`, never `PLUGIN`.

## Tier D - GitHub fallback

Use read-only web/GitHub search only after the known sources.

Prefer:
1. official vendor organization;
2. official platform organization;
3. repository linked from an official marketplace;
4. established repositories already indexed above.

Never clone repositories.

## Completeness

For a broad search, attempt every applicable source.

Track:
- searched;
- unavailable;
- not applicable.

Never say "all sources searched" if one applicable source was not actually queried.
