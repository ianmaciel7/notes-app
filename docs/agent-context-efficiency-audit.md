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
