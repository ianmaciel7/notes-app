# Documentation Synchronization

This repository treats documentation as a living part of the implementation.

- Whenever code, behavior, architecture, domain terminology, UI/UX, tooling, or
  verification changes, update every affected canonical document in the same
  task.
- Before finishing, check the ownership map in
  `.agents/skills/context-manager/SKILL.md` and put each fact in exactly one
  canonical owner.
- Do not leave documentation updates as follow-up work when the implementation
  has already changed the documented behavior.
- If no canonical document is affected, state that explicitly in the handoff.
- Run the repository documentation checks after changing control documents.

This rule prevents implementation and project documentation from drifting apart.
