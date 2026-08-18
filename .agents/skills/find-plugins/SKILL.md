---
name: find-plugins
description: Exhaustive read-only discovery and verification of plugins, extensions, Agent Plugins, MCP integrations, and Agent Skills across official vendor sources first, with community metadata only when policy permits. Uses only documented read-only official vendor discovery surfaces for Codex, Claude Code, Cursor, Gemini CLI, and Google Antigravity. Never installs, executes, downloads, clones, modifies files, or accesses secrets.
---

# Find Plugins

Read-only federated discovery for AI coding-agent integrations.

## Mandatory workflow

`DISCOVER -> VERIFY -> NORMALIZE -> DEDUPLICATE -> COMPARE -> RANK -> REPORT`

Never:

`DISCOVER -> DOWNLOAD -> EXECUTE`
`DISCOVER -> INSTALL`
`DISCOVER -> MODIFY`

## Safety boundary

This skill is discovery-only.

Never:
- install, update, enable, disable, or uninstall anything;
- run package managers;
- run community discovery or plugin-manager CLIs;
- run shell or PowerShell commands except documented read-only official vendor CLI discovery commands allowed by this policy;
- run curl, wget, git clone, or remote scripts;
- download archives, binaries, packages, or repositories;
- modify project files, agent configuration, lockfiles, Git config, or MCP config;
- inspect `.env`, tokens, API keys, SSH keys, credentials, browser data, cloud credentials, Docker credentials, or Kubernetes credentials;
- execute commands copied from documentation;
- execute plugin code.

Only use documented read-only official vendor CLI discovery surfaces, safe read-only web/research capabilities, public documentation, marketplace metadata, manifests rendered as text, and public repository pages.

## Official CLI discovery policy

Prefer official vendor CLIs for plugin discovery whenever the vendor provides a documented read-only discovery mechanism.

Allowed CLI families only:
- `codex`
- `claude`
- `cursor` / `cursor-agent`
- `gemini`
- `agy`

Allowed vendors only:
- OpenAI
- Anthropic
- Cursor / Anysphere
- Google

Even for allowed vendors, execute a CLI command only when all conditions are true:
- official vendor;
- documented command;
- read-only operation;
- no plugin execution;
- no installation;
- no configuration modification.

If any condition is uncertain, do not run the command. Use the official public marketplace, directory, documentation, or other official public metadata in read-only mode instead.

Never execute community discovery or plugin-manager CLIs, including:
- `ccpi`
- `agentplugins`
- `plugin-kit-ai`
- `pluginpack`
- `aipm`
- `skill-of-skills`
- `SkillDock`
- unknown npm/npx plugin tools;
- community marketplace CLIs.

Community sources may be inspected only as public web metadata when the configured source policy permits them. Their executable code must not be run.

Do not execute plugin installation commands during discovery, and never install a result automatically.

## Discovery priority

For every plugin query, use this order:
1. Official vendor CLI with documented read-only discovery.
2. Official vendor marketplace or directory.
3. Official vendor documentation.
4. Public read-only metadata from the official vendor.
5. Policy-permitted public community metadata, if needed for completeness.

Never use a community CLI merely because it provides a better search command.

## Vendor discovery surfaces

### OpenAI / Codex

Prefer the official Codex CLI plugin browser:
- `codex`
- `/plugins`

Use the Codex plugin directory as an official source. Inspect results exposed by the official Codex plugin system, but do not install anything automatically.

### Anthropic / Claude Code

Prefer the official Claude Code plugin discovery system:
- `claude`
- `/plugin`
- `Discover`

Search the official Anthropic marketplace first. Additional configured Claude marketplaces may be considered only if the user explicitly allows non-official sources. Discovery must remain read-only.

### Cursor

Use Cursor's official plugin ecosystem only.

Prefer:
- Cursor Marketplace
- Customize Plugins

Use keyword search from the official Cursor interface when available. Do not invent commands such as `cursor plugin search` unless current official Cursor documentation explicitly documents them. If no official CLI search mechanism exists, use the official Cursor Marketplace through safe read-only research.

### Google Gemini CLI

Use the official Gemini CLI extension system when applicable.

The CLI may expose `/extension explore` to open the official Extensions Gallery. Installed extensions may be inspected with documented read-only commands such as `gemini extensions list`, but do not treat installed-extension listing as marketplace search.

For actual discovery, use the official Gemini Extensions Gallery when the CLI does not expose a machine-readable search command.

### Google Antigravity / AGY

Use only the official Antigravity CLI.

For `find-plugins`, only read-only operations are allowed. `agy plugin list` may be used to inspect plugins already installed if it is documented and read-only.

Forbidden during discovery:
- `agy plugin install`
- `agy plugin enable`
- `agy plugin disable`
- `agy plugin uninstall`

Do not invent `agy plugin search` unless Google officially introduces and documents it. If AGY does not provide plugin marketplace search, use official Antigravity documentation or official Google plugin surfaces through safe read-only research.

## Source coverage

For broad searches, consult every applicable source in `references/sources.md`, following the official-source router and CLI policy above.

Do not stop after the first good result.

If a source cannot be queried, mark it `UNAVAILABLE`.

Do not claim exhaustive coverage unless all applicable configured sources were attempted.

## Verification

Follow `references/trust-model.md`.

Important:
- schema validity is not safety;
- popularity is not trust;
- marketplace presence is not official status;
- lack of evidence is not compatibility.

## Compatibility

Follow `references/compatibility.md`.

Never infer platform support.

Use:
- `VERIFIED`
- `CLAIMED`
- `NOT_VERIFIED`
- `INCOMPATIBLE`

## Deduplication

Merge duplicate appearances into one canonical candidate using, in order:
1. original repository URL;
2. original publisher + canonical project name;
3. manifest/package identity;
4. official homepage.

Keep the list of catalogs where the candidate was found.

## Ranking

Rank by provenance first:

1. first-party native plugin;
2. first-party native extension;
3. verified third-party plugin from an official marketplace;
4. verified third-party extension from an official marketplace;
5. verified Agent Plugin;
6. official MCP equivalent if no native plugin exists;
7. community plugin with clear provenance;
8. official/verified Agent Skill when no plugin-equivalent exists;
9. unverified result only for completeness.

Trust outranks popularity.
Compatibility never overrides trust.

## Cross-source comparison

For strong candidates, compare marketplace/index metadata with the original source.

Check:
- name;
- publisher;
- original repository;
- integration type;
- supported platforms;
- version/update metadata when visible.

Report mismatches.

## Output

Follow `references/output-format.md`.

Keep results concise but include:
- canonical name;
- platforms;
- integration type;
- publisher;
- trust;
- format/schema status when known;
- compatibility status;
- catalogs where found;
- original source;
- important metadata mismatches.

## Installation

Do not show installation commands unless the user explicitly asks how to install one specific result.

If asked:
1. re-verify the current original/official installation documentation;
2. show the platform-native method as text only;
3. state that it was not executed;
4. do not execute it.

## No-web behavior

If safe read-only web access is unavailable, do not guess.

State that current plugin availability cannot be safely verified.

## References

- `references/sources.md` - required discovery sources and search order
- `references/trust-model.md` - provenance, trust, schema, and risk boundaries
- `references/compatibility.md` - evidence-based multi-agent compatibility
- `references/output-format.md` - result and source-coverage format
