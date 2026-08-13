# Compatibility and Capability Evidence

Never infer compatibility.

## Compatibility statuses

### VERIFIED
Supported by strong direct evidence, such as:
- official platform documentation;
- official marketplace listing;
- original plugin manifest;
- original publisher documentation.

### CLAIMED
A community catalog or secondary source claims support, but strong direct evidence was not verified.

### NOT_VERIFIED
No reliable evidence was found.

### INCOMPATIBLE
Reliable evidence shows the platform is not supported.

## Capability matrix

When a candidate targets multiple agents, build an evidence-based matrix when useful.

Example:

| Capability | Claude | Cursor | Codex | Gemini | Antigravity |
|---|---|---|---|---|---|
| Native plugin | VERIFIED | VERIFIED | NOT_VERIFIED | INCOMPATIBLE | NOT_VERIFIED |
| Agent Skill | VERIFIED | VERIFIED | VERIFIED | VERIFIED | CLAIMED |
| MCP | VERIFIED | VERIFIED | VERIFIED | VERIFIED | VERIFIED |
| Hooks | VERIFIED | CLAIMED | INCOMPATIBLE | CLAIMED | VERIFIED |

Do not fabricate entries.
Omit capabilities that were not investigated.

## Canonical identity

One project may appear in many catalogs or platform-specific wrappers.

Prefer:

`one canonical candidate + platform appearances`

instead of multiple duplicate candidates.

Track:
- canonical repository;
- original publisher;
- canonical name;
- each platform appearance;
- evidence for each platform.

## Graceful degradation

If a project is:
- a native plugin on Platform A;
- only an MCP integration on Platform B;
- only an Agent Skill on Platform C;

report that distinction explicitly.

Do not collapse all integration types into "plugin".

## No evidence rule

`NO EVIDENCE = NOT_VERIFIED`

Never:
`NO EVIDENCE = probably supported`

## First-party preference

When trust is comparable:
1. native official integration;
2. official cross-platform integration;
3. verified third-party native integration;
4. verified Agent Plugin;
5. official MCP equivalent;
6. Agent Skill alternative.

Do not sacrifice provenance for portability.
