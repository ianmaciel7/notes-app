# OpenSpec First

- Use OpenSpec for durable requirements, behavior, acceptance criteria, design rationale, alternatives, trade-offs, and change lifecycle work.
- Before changing repository code or documentation, identify an existing active OpenSpec change that covers the work or create/update one under `openspec/changes/`.
- The OpenSpec change must describe the intended scope before implementation begins.
- Tiny mechanical corrections may use the current active change as the scope record, but the completion summary must still mention the OpenSpec coverage.
- If code or documentation work reveals a durable decision, update the relevant OpenSpec artifact before claiming completion.
- Create active proposed changes under `openspec/changes/`.
- Keep accepted canonical requirements under `openspec/specs/`.
- When information becomes durable, move it into `openspec/specs/` whenever possible instead of leaving it in transient notes, scratch files, or agent-only docs.
- When a change is complete, sync its delta specs into `openspec/specs/` when applicable and archive it under `openspec/changes/archive/` whenever possible.
- Do not create parallel planning, memory, task, or spec files for information that belongs in OpenSpec.
- Keep software verification and OpenSpec verification as separate evidence.
