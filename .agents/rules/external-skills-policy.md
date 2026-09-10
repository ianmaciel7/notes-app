---
trigger: always_on
description: Policy prohibiting modification of external / third-party agent skills installed in .agents/skills/ or global skill directories.
---

# External Skills Immutability Policy

1. **No Direct Modifications to External Skills**:
   - Files and scripts inside `.agents/skills/` or installed external skill packages are treated as immutable upstream artifacts.
   - Do NOT edit, patch, or alter files inside `.agents/skills/` directly.

2. **Project Local Overrides & Extensions**:
   - When custom behavior, profile selection, or environment patches are required for scripts/workflows:
     - Create project-specific scripts in `scripts/` (e.g. `scripts/open_browser.py`).
     - Update local project rules (`.agents/rules/`) to reference project-level scripts instead of modifying external skills.

3. **Custom Skill Authorization**:
   - Only modify skills created specifically by/for this repository or explicitly declared as user-owned custom skills.
