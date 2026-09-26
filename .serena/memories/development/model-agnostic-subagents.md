# AI Tool and Model Agnosticism in Subagents and Skills

## Rule
Subagent prompts, dispatch templates, and skill workflows must remain **agnostic to specific AI models and tools** (Codex, AGY, Claude Code, Gemini, etc.).

## Guidelines
- Never hardcode vendor-specific model identifiers (e.g. `flash_lite`, `claude-3-5-sonnet`, `o3-mini`) in templates, skills, or subagent prompts.
- Use tier/strategy abstractions instead (e.g., lightweight/fast tier for exploration vs inherited or reasoning tier for synthesis/review).
- Subagent dispatch instructions must work seamlessly across any orchestrating coding tool in this multi-AI environment.
