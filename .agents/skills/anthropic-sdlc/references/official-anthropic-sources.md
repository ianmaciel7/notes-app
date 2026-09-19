# Official Anthropic source map

This skill is derived from Anthropic's official AI-native SDLC Playbook and Claude Code practices. It intentionally avoids importing third-party SDLC conventions as authoritative Anthropic guidance.

## AI-native SDLC Playbook

- Overview / Introduction
  https://academy.claude.com/courses/ai-native-sdlc-playbook/introduction

- Capture as intent.md
  https://academy.claude.com/courses/ai-native-sdlc-playbook/capture-intent

- Requirements and design
  https://academy.claude.com/courses/ai-native-sdlc-playbook/requirements-and-design

- Claude Code plan mode as the default starting point
  https://academy.claude.com/courses/ai-native-sdlc-playbook/plan-mode

- The repository guidance file (`AGENTS.md` in this project; Anthropic's source material calls the equivalent file `CLAUDE.md`)
  https://academy.claude.com/courses/ai-native-sdlc-playbook/claude-md

- Skills as institutional knowledge
  https://academy.claude.com/courses/ai-native-sdlc-playbook/skills-as-institutional-knowledge

- Parallel sessions and subagents
  https://academy.claude.com/courses/ai-native-sdlc-playbook/parallel-sessions-and-subagents

- Give Claude a feedback loop
  https://academy.claude.com/courses/ai-native-sdlc-playbook/give-claude-a-feedback-loop

- Continuous evals in CI
  https://academy.claude.com/courses/ai-native-sdlc-playbook/continuous-evals-in-ci

- AI in the PR review loop
  https://academy.claude.com/courses/ai-native-sdlc-playbook/ai-in-the-pr-review-loop

- Hooks as approval gates
  https://academy.claude.com/courses/ai-native-sdlc-playbook/hooks-as-approval-gates

- CI/CD integration and deployment
  https://academy.claude.com/courses/ai-native-sdlc-playbook/ci-cd-integration-and-deployment

- Closing the loop on metrics
  https://academy.claude.com/courses/ai-native-sdlc-playbook/closing-the-loop-on-metrics

## Notes on interpretation

- The official playbook is modular; not every repository must automate every stage immediately.
- Anthropic recommends committed artifacts as handoffs between stages.
- Human accountability remains at judgment gates.
- Skills are advisory; deterministic enforcement belongs in hooks/checks.
- `AGENTS.md` should remain concise and focused on durable repository context.
