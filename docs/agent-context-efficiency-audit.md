# Agent Context Efficiency Audit

Last audited: 2026-08-08

This audit records the current context, cache, session, and repository-intelligence controls for this project. It is an evidence log and operating policy. It is not permission to change user-level CLI configuration without a separate explicit request.

Core rule: measure before adding infrastructure or raising context budgets. Large context windows are reserve capacity, not a target.

## Current Baseline

| Area | Observed state | Decision |
| --- | --- | --- |
| Project agent rules | `AGENTS.md` owns universal execution rules; `CLAUDE.md` is a pointer to `AGENTS.md`. | Keep shared rules concise and reference this audit instead of copying it. |
| OpenSpec | `openspec/config.yaml` is minimal and OpenSpec workflows live in `.agents/workflows/`. | Use OpenSpec config for OpenSpec-specific context only. |
| Gemini CLI | `gemini.cmd --version` reports `0.49.0`; `~/.gemini/settings.json` was absent; `GEMINI_API_KEY`, `GOOGLE_GENAI_USE_VERTEXAI`, and `GOOGLE_GENAI_USE_GCA` were not set. | Gemini auth, `/stats`, sessions, and investigator benchmarks are blocked until auth is configured. |
| Codex CLI | `codex.cmd --version` reports `0.147.0`; `~/.codex/config.toml` has `model = "gpt-5.5"` and `model_reasoning_effort = "xhigh"`. | Codex is the only locally inspectable configured agent runtime in this audit. |
| Claude Code | No `claude` or `claude.cmd` executable was found on PATH, and no `~/.claude` directory was observed. | Mark Claude Code behavior as not locally verifiable until an install path/version is provided. |
| External repository intelligence | No CodeGraph, Serena, or similar repository-intelligence MCP is configured in this repo. | Do not add one unless benchmark evidence shows value beyond native capabilities. |

## Gemini CLI Controls

Local bundled Gemini CLI docs were inspected under `C:\Users\ianma\AppData\Roaming\npm\node_modules\@google\gemini-cli\bundle\docs`.

| Control | Current support | Audit result |
| --- | --- | --- |
| `model.maxSessionTurns` | Supported. Default documented as `-1`, meaning unlimited. | Do not enable project Gemini usage with the default unlimited setting. Choose a finite limit only after sampling normal task sessions. |
| `model.summarizeToolOutput` | Supported per-tool; bundled docs say only `run_shell_command` supports summarization currently. | Treat as tool-output summarization, not a substitute for masking or pruning old output. |
| `tools.truncateToolOutputThreshold` | Supported. Default documented as `40000` characters. | Keep as a display/output safety guard; do not confuse truncation with durable knowledge preservation. |
| `experimental.contextManagement` | Supported. Default documented as `false`. | Audit and enable only deliberately, because it changes active context behavior and requires restart. |
| `contextManagement.historyWindow.maxTokens` | Supported. Default documented as `150000`. | Use as the compression trigger budget when context management is enabled. |
| `contextManagement.historyWindow.retainedTokens` | Supported. Default documented as `40000`. | Retain only current-task-critical context, not arbitrary old history. |
| `contextManagement.messageLimits.normalMaxTokens` | Supported. Default documented as `2500`. | Use for ordinary turns after measuring typical tool output size. |
| `contextManagement.messageLimits.retainedMaxTokens` | Supported. Default documented as `12000`. | Prevent single turns from dominating the retained window. |
| `contextManagement.messageLimits.normalizationHeadRatio` | Supported. Default documented as `0.25`. | Preserve enough leading context for file paths, commands, and error headings. |
| `contextManagement.tools.distillation.maxOutputTokens` | Supported. Default documented as `10000`. | Distill large but potentially useful current output. |
| `contextManagement.tools.distillation.summarizationThresholdTokens` | Supported. Default documented as `20000`. | Summarize only when output is too large to retain directly. |
| `contextManagement.tools.outputMasking.protectionThresholdTokens` | Supported. Default documented as `50000`. | Protect recent important tool output. |
| `contextManagement.tools.outputMasking.minPrunableThresholdTokens` | Supported. Default documented as `30000`. | Mask old tool output when enough low-value material exists. |
| `contextManagement.tools.outputMasking.protectLatestTurn` | Supported. Default documented as `true`. | Keep enabled; latest-turn output should not be masked. |

Preferred Gemini context hierarchy:

1. Remove or mask irrelevant old output.
2. Distill large but potentially useful output.
3. Retain important current evidence.
4. Persist only durable conclusions as small verified knowledge.

Do not repeatedly summarize content that can be removed from active context. Summaries are for useful signal; masking and pruning are for stale bulk.

### Gemini Session Boundary Policy

`model.maxSessionTurns` must not stay effectively unlimited after Gemini is configured for this project. A final limit is intentionally not selected in this audit because Gemini sessions could not be listed without auth.

Before setting the limit:

1. Record at least five normal completed project tasks.
2. For each task, record user/model/tool turns, tool calls, files read, large-output events, and whether the task ended with a verified result.
3. Set `model.maxSessionTurns` to a value that covers normal single-task work plus a small buffer, not multi-task mega-sessions.
4. Recheck after the next five completed Gemini sessions.

Operational default until measurement is available:

- Use a new Gemini session for each new task.
- Do not resume a Gemini session for unrelated task B after task A has a verified result.
- If a one-off privacy-sensitive task is done, exit with session deletion where appropriate.

### Gemini Auth And Token Caching

Current local auth status:

| Field | Observed |
| --- | --- |
| Authentication mode | None configured locally. |
| `~/.gemini/settings.json` | Absent. |
| `GEMINI_API_KEY` | Not set. |
| `GOOGLE_GENAI_USE_VERTEXAI` | Not set. |
| `GOOGLE_GENAI_USE_GCA` | Not set. |
| Cache available now? | No active authenticated mode, so unavailable in practice. |
| Cached tokens observed? | No. `/stats` is blocked by missing auth. |
| Effective savings | Not measurable yet. |

Bundled Gemini docs say token caching is available for Gemini API key and Vertex AI auth, and not available for OAuth because the Code Assist API does not support cached content creation. After auth is configured, run `/stats model` or `/stats session` and record cached token usage before changing auth solely for caching.

Do not switch auth mode solely for token caching. Consider pricing, quotas, security, privacy, operational ownership, and whether paid-tier data handling is required.

### Gemini Native Codebase Investigator

Gemini CLI `0.49.0` includes a built-in `codebase_investigator` subagent. It is intended for codebase analysis, dependency mapping, and subsystem understanding. It runs in an isolated context and can be forced with `@codebase_investigator`.

Because Gemini auth is not configured, this audit could not benchmark it. Before adding CodeGraph, Serena, or another repository-intelligence MCP, benchmark the native investigator on this repo:

| Benchmark task | Success criterion |
| --- | --- |
| Find implementation | Finds the relevant implementation file and symbol without excessive unrelated reads. |
| Find references | Identifies internal references and distinguishes tests, docs, and runtime usage. |
| Trace dependency | Explains direct dependencies and call/data flow with file evidence. |
| Identify impact | Lists likely affected surfaces for a change without inventing unrelated owners. |
| Understand subsystem | Produces a compact explanation that matches the code and project conventions. |

Record tool calls, files read, tokens consumed, accuracy, latency, and maintenance overhead. Prefer the native investigator if it is sufficient.

## Codex CLI Controls

Local Codex facts:

| Field | Observed |
| --- | --- |
| Version | `codex-cli 0.147.0` |
| Configured model | `gpt-5.5` |
| Configured reasoning | `model_reasoning_effort = "xhigh"` |
| Service tier | `default` |
| Active model default reasoning | `medium` |
| Active model supported reasoning | `low`, `medium`, `high`, `xhigh` |
| Local model context window | `272000` tokens from `codex debug models` |
| Local model max context window | `272000` tokens from `codex debug models` |
| Effective context percent | `95` |
| Truncation policy | Token mode, `10000` token limit |

Official OpenAI model docs for `gpt-5.5` currently list a 1,050,000 token API context window, $5.00 per 1M input tokens, $0.50 per 1M cached input tokens, and $30.00 per 1M output tokens. They also state that prompts over 272K input tokens are priced at 2x input and 1.5x output for the full session on standard, batch, and flex. The local Codex model catalog reports a smaller 272K active context window, so this project must use the local catalog as the runtime limit and the public model page as pricing context.

Official source: https://developers.openai.com/api/docs/models/gpt-5.5

### Planning Versus Execution Reasoning

`model_reasoning_effort` is configured globally as `xhigh`. `plan_mode_reasoning_effort` is not present in `~/.codex/config.toml`. A strict-config probe could not prove support because `codex debug` rejects `--strict-config`, and `codex doctor` did not reject an intentionally bogus config override before running health checks.

Policy:

- Do not assume planning and implementation need the same reasoning budget.
- Do not globally force maximum reasoning in Plan mode without measured quality benefit.
- If `plan_mode_reasoning_effort` is verified in a future Codex version, test complex planning at `medium` or `high` before using `xhigh`.
- Keep routine execution at the cheapest effort level that does not increase retries, missed instructions, or total token use.

### Subagents And Workers

Feature flag snapshot:

| Feature | Stage | State |
| --- | --- | --- |
| `multi_agent` | stable | true |
| `multi_agent_v2` | stable | false |
| `enable_request_compression` | stable | true |
| `remote_compaction_v2` | stable | true |
| `memories` | stable | false |
| `token_budget` | under development | false |
| `local_thread_store_compression` | under development | false |
| `runtime_metrics` | under development | false |

No independent subagent model or reasoning setting was found in the current project or user config. If a future Codex version exposes worker-level model or reasoning settings, benchmark total cost rather than per-call price. A cheaper worker is not useful if it causes retries, wrong conclusions, or larger total context.

Suggested worker benchmark:

| Worker use | Initial budget to test |
| --- | --- |
| Repository exploration | Same model family at `low` or `medium`, evidence-only output. |
| Log scanning | Cheapest sufficient model/effort with strict output schema. |
| Reference discovery | Low/medium reasoning, compact file/path evidence. |
| Simple research | Low/medium reasoning unless accuracy drops. |

### Memory Generation Versus Memory Injection

The `memories` feature is listed as stable but disabled locally. No active `memories.generate_memories` or `memories.use_memories` setting was found in project config.

If memory is enabled later, separate the decisions:

- Generate: should Codex derive durable memory from previous work?
- Use: should existing memory be injected or retrieved for the current session?

Audit memory relevance, age, usage frequency, injection size, duplicate knowledge, and stale instructions. Prefer selective retrieval over automatic injection into every session.

## Claude Code Controls

Claude Code is not locally verifiable in this environment. Do not create or duplicate Claude-specific rules until a concrete installed version can be inspected.

When Claude Code is available, audit these before changing active-task configuration:

| Control | Audit requirement |
| --- | --- |
| Model changes | Check whether changing models invalidates all or part of the prompt cache. |
| Reasoning effort changes | Verify whether effort changes preserve prompt-cache compatibility for the same model. |
| MCP server set | Configure near session start when possible; changing tools may invalidate cached prefix. |
| Tool availability | Avoid mid-task churn unless correctness requires it. |
| Compaction | Use for same-task useful history when context is too large, not merely because history exists. |
| `/recap` | Use for concise status or handoff without replacing history. |
| `/compact` | Use to replace or reduce accumulated context while continuing the same task. |
| `/clear` | Use for a different task or obsolete context. |
| `/rewind` | Use when recent exploration became invalid and a previous conversation state is better. |

Official Claude pricing docs currently state that prompt caching reads cost 0.1x base input price, 5-minute cache writes cost 1.25x, and 1-hour cache writes cost 2x. They also state that Claude 4.6 and later US-only inference uses a 1.1x multiplier, and that long-context pricing differs by model/version.

Official source: https://platform.claude.com/docs/en/about-claude/pricing

## OpenSpec And Documentation Ownership

Avoid repeating the same project knowledge across agent documents.

| Knowledge type | Owner |
| --- | --- |
| Universal agent execution rules | `AGENTS.md` |
| Claude entrypoint pointer | `CLAUDE.md` |
| OpenSpec-specific project/spec context | `openspec/config.yaml` |
| Behavior and requirements | OpenSpec specs |
| Durable operational lessons | Memory system, only when enabled and curated |
| Procedures and reusable workflows | Skills and `.agents/workflows/` |
| Context/cache/session audit | `docs/agent-context-efficiency-audit.md` |

References are preferred to copies. If this audit leads to a permanent universal rule, add the shortest possible pointer to `AGENTS.md`; keep measurements and tool-specific details here.

## Large Context Window Policy

Large windows are emergency capacity. They do not justify carrying irrelevant history.

Current inspected context/pricing facts:

| Runtime/model | Context and pricing observations | Policy |
| --- | --- | --- |
| Codex local `gpt-5.5` | Local catalog: 272K context, 95 percent effective context, 10K truncation limit. Official model page: 1,050K API context; $5 input, $0.50 cached input, $30 output per 1M tokens; >272K input triggers higher long-context pricing for the full session. | Keep active sessions well below 272K. Treat >272K public-model capacity as expensive reserve, not normal working set. |
| Gemini CLI | Installed CLI docs advertise Gemini 3 model support and context-management controls, but local auth is absent and active model is unknown. Official Gemini pricing for `gemini-3.1-pro-preview` has a 200K prompt pricing threshold, with higher prices above that threshold. | Do not choose a Gemini model or session limit until auth and active model are known. Record `/stats` and cache behavior first. |
| Claude Code | Not installed locally. Official Claude docs describe prompt-caching multipliers and model-specific long-context behavior. | Verify installed model, cache, and context behavior before applying Claude-specific rules. |

Official Gemini pricing source: https://ai.google.dev/gemini-api/docs/pricing

## Required Follow-Up Measurements

Before changing CLI config, collect this evidence:

| Runtime | Measurement |
| --- | --- |
| Gemini | Configure auth intentionally, then run `/stats session`, `/stats model`, and the native investigator benchmark. |
| Gemini | Sample at least five normal single-task sessions before setting `model.maxSessionTurns`. |
| Gemini | Test `contextManagement` with a large command output and record whether masking, distillation, summarization, and latest-turn protection behave as expected. |
| Codex | Verify whether a future CLI exposes `plan_mode_reasoning_effort`, worker model/effort settings, or separate memory generate/use settings. |
| Codex | Compare `medium`, `high`, and `xhigh` reasoning on one planning-heavy task and one implementation-heavy task; measure retries and total tokens, not only quality. |
| Claude Code | Locate install/version, then verify cache behavior for model switches, effort switches, MCP set changes, compaction, recap, clear, and rewind. |

## Acceptance Checklist

- No user-level CLI config changed by this audit.
- No credentials, auth tokens, session transcript contents, or prompt history are copied into this document.
- No external repository-intelligence MCP is introduced without benchmark evidence.
- Session limits are selected from observed task behavior, not arbitrary context-window size.
- Masking, distillation, summarization, truncation, and durable memory are treated as separate mechanisms.
- Pricing and long-context thresholds are rechecked against official provider docs before budgeting or changing model policy.

## Final Stack Selection

Decision date: 2026-08-08.

Only static, project-local context configuration was installed. No MCP server, global package, hook, binary, worker service, or external memory system was installed.

| Tool / Skill | Purpose | Existing equivalent? | Security assessment | Expected token benefit | Complexity | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| `GEMINI.md` | Gemini entrypoint that points to shared rules. | `CLAUDE.md` already does this for Claude. | Low; one-line project file. | Prevents duplicated Gemini instructions. | Low. | INSTALL |
| `.geminiignore` | Keep generated output, secrets, and local indexes out of Gemini context. | `.gitignore` partially overlaps. | Low; denylist only. | Reduces accidental context bloat and secret exposure. | Low. | INSTALL |
| `AGENTS.md` context rules | Shared native-first, output-filtering, and YAGNI policy. | No concise shared rule existed. | Low; project instructions only. | Prevents repeated tool/output waste. | Low. | INSTALL |
| Existing `filesystem-context` Skill | File-backed scratch/state guidance. | Already project-local under `.agents/skills`. | Low to medium; instructions must not be used to store secrets. | High when sessions need overflow state. | Low. | KEEP |
| NeoLab `context-engineering` Skill | General context-engineering guidance. | Existing project skills already cover context fundamentals and optimization. | Low for selected file, but duplicate. | Low incremental benefit. | Low. | DEFER |
| `codebase-memory-mcp` | Semantic repository index and MCP tools. | Native shell search is sufficient for current repo size; Gemini native investigator exists but cannot be benchmarked without auth. | Medium; reads source tree, writes agent config, and spawns background process. | Unproven for this repo. | Medium. | DEFER |
| CodeGraph | Local code graph and auto agent integration. | Overlaps semantic-index role. | Medium; telemetry defaults and Node engine mismatch with local Node 25.2.1. | Unproven, and README notes possible higher residual context. | Medium. | DEFER |
| Serena | LSP-backed semantic navigation, editing, and memory. | Overlaps semantic-index and memory roles. | Medium; broad dependency and tool surface. | Unproven for this small repo. | High. | DEFER |
| Context Mode | Tool-output/session context middleware. | Native filtering and ignores cover current need. | Medium to high; hooks, SQLite storage, and command/tool interception. | Needs pilot evidence. | High. | PILOT / DEFER |
| RTK | Command-output token proxy. | Deterministic shell filtering covers current need. | Medium; command interception hooks. | Marketing claim only for this repo. | Medium. | REJECT / DEFER |
| Headroom | Compression proxy/MCP/SDK for tool outputs and contexts. | Overlaps Context Mode and native output controls. | Medium to high; proxy/MCP and optional broad dependencies. | Unproven and redundant now. | High. | DEFER |
| `claude-mem` | Persistent memory and cross-session injection. | Native memory should be evaluated first; project memory need not proven. | Medium to high; session capture, worker service, local UI, provider integration. | Unproven; memory generation has its own cost. | High. | DEFER |
| Caveman | Output style compression and optional memory rewrite. | Concise agent responses and small context files cover current need. | Medium; installer/hooks if enabled. | Does not stop irrelevant context entering prompts. | Medium. | REJECT |

### Installed

- `GEMINI.md`: one-line pointer to `AGENTS.md`.
- `.geminiignore`: excludes dependencies, generated output, secrets, local agent indexes, and debug logs from Gemini context.
- `.gitignore`: excludes local agent/context indexes and scratch state.
- `AGENTS.md`: adds concise context efficiency, deterministic output filtering, and YAGNI rules, plus a pointer to this audit.

### Project-Local Skills Kept

Top-level project-local skills observed under `.agents/skills`:

`acquire-codebase-knowledge`, `agent-browser`, `agent-governance`, `agentic-eval`, `agents-md`, `context-engineering-collection`, `design-md`, `enhance-prompt`, `find-skills`, `firebase-app-hosting-basics`, `firebase-auth-basics`, `firebase-basics`, `firebase-security-rules-auditor`, `frontend-design`, `gh-address-comments`, `gh-fix-ci`, `github`, `graph-orchestrator`, `harness-engineering`, `next-best-practices`, `next-cache-components`, `openspec-apply-change`, `openspec-archive-change`, `openspec-bulk-archive-change`, `openspec-continue-change`, `openspec-explore`, `openspec-ff-change`, `openspec-new-change`, `openspec-onboard`, `openspec-sync-specs`, `openspec-verify-change`, `shadcn`, `skill-creator`, `smithery-ai-cli`, `stitch-code-to-design`, `stitch-extract-design-md`, `stitch-extract-static-html`, `stitch-generate-design`, `stitch-loop`, `stitch-manage-design-system`, `stitch-react-components`, `stitch-upload-to-stitch`, `taste-design`, `tdd-red-green-refactor`, `typed-service-contracts`, `vercel-composition-patterns`, `vercel-react-best-practices`, `vitest`, `web-design-guidelines`.

Relevant context stack skills already present:

- `.agents/skills/context-engineering-collection/skills/context-optimization/SKILL.md`
- `.agents/skills/context-engineering-collection/skills/filesystem-context/SKILL.md`
- `.agents/skills/context-engineering-collection/skills/context-compression/SKILL.md`
- `.agents/skills/context-engineering-collection/skills/memory-systems/SKILL.md`

No duplicate Skill was installed.

### Semantic Code Intelligence

Selected solution: native and deterministic search for now.

Evidence:

- `rg --files src` found only `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, and `src/app/favicon.ico`.
- `rg -n "export|function|const|metadata|Home|RootLayout" src` found `Home`, `RootLayout`, font constants, and metadata in one targeted pass.
- For this repository size, a semantic MCP index would add installation, indexing, permissions, and maintenance overhead before there is evidence of repeated semantic-navigation waste.
- Gemini CLI includes a native `codebase_investigator` subagent, but Gemini auth is not configured, so it must be benchmarked before any external index is installed.

### OpenSpec

Status: existing and preserved.

`openspec/config.yaml` exists and is minimal. There are no `openspec/specs/` or `openspec/changes/` directories in the observed repo state. OpenSpec remains the canonical place for governed behavior and change artifacts if the project later needs spec-driven work. No competing spec system was installed.

### Context Middleware

Status: none retained.

Context Mode is a pilot candidate only. It was not installed because it participates deeply in execution through hooks/tool interception and SQLite storage, and the repository does not yet show a large-output problem that native filtering and `.geminiignore` cannot handle.

### Third-Party Security Classifications

Tool: NeoLab `context-engineering` Skill
Source: `NeoLabHQ/context-engineering-kit`
Maintainer: NeoLabHQ
Purpose: Context-window management and progressive-disclosure guidance.
Install scope: Not installed; evaluated as a project-local Skill candidate.
Filesystem access: Instructional only in inspected `SKILL.md`.
Network access: None observed in inspected `SKILL.md`.
Shell execution: None observed in inspected `SKILL.md`.
Hooks: None observed in inspected `SKILL.md`.
Telemetry: None observed.
Secrets exposure risk: Low for the selected file.
Supply-chain protections: GitHub source only; no release signing evidence used.
Security scanner findings: None found during audit.
Overlap with existing tools: Overlaps local `context-engineering-collection` skills.
Recommendation: DEFER.

Tool: `filesystem-context` Skill
Source: `muratcankoylan/Agent-Skills-for-Context-Engineering`
Maintainer: Murat Can Koylan
Purpose: File-backed context overflow, scratchpads, indexes, and just-in-time retrieval.
Install scope: Existing project-local copy under `.agents/skills`.
Filesystem access: Instructional writes to project scratch/context files.
Network access: None observed in inspected `SKILL.md`.
Shell execution: None observed in inspected `SKILL.md`.
Hooks: None observed in inspected `SKILL.md`.
Telemetry: None observed.
Secrets exposure risk: Medium if misused to store secrets; mitigated by `.gitignore`, `.geminiignore`, and policy not to persist secrets.
Supply-chain protections: GitHub source only; no release signing evidence used.
Security scanner findings: None found during audit.
Overlap with existing tools: Exact desired capability already installed locally.
Recommendation: KEEP.

Tool: `codebase-memory-mcp`
Source: `DeusData/codebase-memory-mcp`
Maintainer: DeusData
Purpose: Semantic repository index, graph search, snippets, ADR/memory, and MCP code-intelligence tools.
Install scope: Not installed; would be project/user MCP if later selected.
Filesystem access: Reads source tree, writes cache and agent config files.
Network access: Local processing; security docs mention an optional GitHub release update check.
Shell execution: Spawns background processes per security docs.
Hooks: MCP server integration; no project hooks installed.
Telemetry: Security docs say no telemetry or source upload.
Secrets exposure risk: Medium because repository-wide reads can include accidental secrets.
Supply-chain protections: Security docs claim SLSA provenance, Sigstore signing, and SHA-256 checksums.
Security scanner findings: No independent scanner result used.
Overlap with existing tools: Overlaps Gemini native investigator and shell/native repository navigation.
Recommendation: DEFER.

Tool: CodeGraph
Source: `colbymchenry/codegraph`
Maintainer: Colby McHenry
Purpose: Local code graph, symbol/references/call graph, and agent integrations.
Install scope: Not installed.
Filesystem access: Indexes repository and creates `.codegraph/` state when installed.
Network access: README advertises local-first behavior; package/docs include telemetry controls.
Shell execution: CLI install/integration commands.
Hooks: Agent integration may add instructions/configuration.
Telemetry: Enabled unless disabled according to project docs.
Secrets exposure risk: Medium because it reads project source.
Supply-chain protections: GitHub/npm source; release pipeline claims were noted but not relied on.
Security scanner findings: None used.
Overlap with existing tools: Same semantic-index role as `codebase-memory-mcp` and Serena.
Recommendation: DEFER.

Tool: Serena
Source: `oraios/serena`
Maintainer: Oraios
Purpose: LSP-backed semantic navigation, editing, refactoring, memory, and MCP tools.
Install scope: Not installed.
Filesystem access: Broad repository read/write if used for editing/refactoring.
Network access: Dependency ecosystem may fetch packages; runtime network not required for core local analysis.
Shell execution: uv/python CLI and MCP server.
Hooks: No project hooks installed.
Telemetry: None confirmed during audit.
Secrets exposure risk: Medium because repository-wide tools can read sensitive files if not excluded.
Supply-chain protections: GitHub/uv source; no signing evidence used.
Security scanner findings: None used.
Overlap with existing tools: Overlaps semantic index plus external memory role.
Recommendation: DEFER.

Tool: Context Mode
Source: `mksglu/context-mode`
Maintainer: mksglu
Purpose: Tool-output/session-history capture, filtering, indexing, and retrieval middleware.
Install scope: Not installed; pilot only if later needed.
Filesystem access: Stores indexed content under local context storage.
Network access: Package install/network required; runtime network not required for local storage in inspected docs.
Shell execution: CLI plus command/tool interception.
Hooks: Claude/Codex hooks and Gemini/Antigravity MCP-style integration per docs.
Telemetry: None relied on during audit.
Secrets exposure risk: Medium to high because it can capture tool outputs and session data.
Supply-chain protections: npm/GitHub source; no signing evidence used.
Security scanner findings: None used.
Overlap with existing tools: Overlaps native truncation, summarization, `.geminiignore`, and deterministic shell filtering.
Recommendation: PILOT / DEFER.

Tool: RTK
Source: `rtk-ai/rtk`
Maintainer: RTK AI
Purpose: Command proxy that rewrites or compresses common developer command output.
Install scope: Not installed.
Filesystem access: Depends on integration; command proxy may observe shell command paths/output.
Network access: Install/update path not evaluated beyond public repo docs.
Shell execution: Core function is shell command interception/proxying.
Hooks: PreToolUse/BeforeTool-style hooks for multiple agents per docs.
Telemetry: Not fully audited because it is explicitly not needed now.
Secrets exposure risk: Medium because shell output can include sensitive data.
Supply-chain protections: Rust single-binary claim noted; signatures/checksums not verified.
Security scanner findings: None used.
Overlap with existing tools: Overlaps deterministic local filtering and Context Mode.
Recommendation: REJECT / DEFER.

Tool: Headroom
Source: `chopratejas/headroom`
Maintainer: Headroom project maintainers
Purpose: Compress tool outputs, logs, RAG chunks, files, and prompts through SDK/proxy/MCP.
Install scope: Not installed.
Filesystem access: Depends on integration; can process files/tool output.
Network access: Proxy and package integrations may involve provider or local service traffic.
Shell execution: Installer and wrapper commands.
Hooks: MCP/proxy/wrapper integrations.
Telemetry: Not fully audited because no install need was found.
Secrets exposure risk: Medium to high because it can sit between tools/app and model/provider.
Supply-chain protections: Public package/container ecosystem; signatures/checksums not verified.
Security scanner findings: None used.
Overlap with existing tools: Overlaps Context Mode and native output controls.
Recommendation: DEFER.

Tool: `claude-mem`
Source: `thedotmack/claude-mem`
Maintainer: thedotmack
Purpose: Persistent memory capture, semantic summaries, retrieval, and future-session injection.
Install scope: Not installed.
Filesystem access: Captures and stores session/tool observations.
Network access: May call configured AI providers and exposes a local web UI per docs.
Shell execution: Installer, worker, and plugin setup commands.
Hooks: Claude/Gemini style session/tool hooks per docs.
Telemetry: Not fully audited because no install need was found.
Secrets exposure risk: High unless private data exclusions are proven and enforced; session capture can include sensitive output.
Supply-chain protections: Public GitHub/npm/plugin paths; signatures/checksums not verified.
Security scanner findings: None used.
Overlap with existing tools: Overlaps native memory and local curated memory policy.
Recommendation: DEFER.

Tool: Caveman
Source: `JuliusBrussee/caveman`
Maintainer: Julius Brussee
Purpose: Output style compression, optional memory file compression, and related agent integrations.
Install scope: Not installed.
Filesystem access: Optional memory compression can rewrite project instruction files with backups.
Network access: Installer fetches remote scripts.
Shell execution: Install scripts and commands.
Hooks: Agent integrations can add hooks/rules.
Telemetry: Not fully audited because it is not needed.
Secrets exposure risk: Low to medium; memory rewrite can accidentally degrade important instructions.
Supply-chain protections: Public GitHub source; signatures/checksums not verified.
Security scanner findings: None used.
Overlap with existing tools: Overlaps concise response style, not true context selection.
Recommendation: REJECT.

## Verification

- `git status --short` shows only intended project changes: `.gitignore`, `AGENTS.md`, `.geminiignore`, and `GEMINI.md`.
- `git diff --stat` shows 17 tracked-line additions across `.gitignore` and `AGENTS.md`; new untracked files are intentionally separate.
- `pnpm` is not on PATH in this shell, so project lint/format commands could not be run without changing the package-manager setup.
- The environment instruction says WSL2 should be used, but no WSL distribution is installed in this runtime; Windows PowerShell was used for verification.

## Source Links

- OpenAI `gpt-5.5` model docs: https://developers.openai.com/api/docs/models/gpt-5.5
- Claude Code commands: https://code.claude.com/docs/en/commands
- Claude Code hooks: https://code.claude.com/docs/en/hooks
- Gemini CLI configuration: https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md
- Gemini CLI memory file docs: https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html
- Gemini CLI ignore docs: https://google-gemini.github.io/gemini-cli/docs/cli/gemini-ignore.html
- NeoLab context-engineering Skill: https://raw.githubusercontent.com/NeoLabHQ/context-engineering-kit/master/plugins/customaize-agent/skills/context-engineering/SKILL.md
- Filesystem-context Skill: https://raw.githubusercontent.com/muratcankoylan/Agent-Skills-for-Context-Engineering/main/skills/filesystem-context/SKILL.md
- `codebase-memory-mcp`: https://github.com/DeusData/codebase-memory-mcp
- CodeGraph: https://github.com/colbymchenry/codegraph
- Serena: https://github.com/oraios/serena
- Context Mode: https://github.com/mksglu/context-mode
- RTK: https://github.com/rtk-ai/rtk
- Headroom: https://github.com/chopratejas/headroom
- `claude-mem`: https://github.com/thedotmack/claude-mem
- Caveman: https://github.com/JuliusBrussee/caveman
