---
description: "Update a change - revise existing planning artifacts and keep them coherent (Experimental)"
---

Revise a change's existing planning artifacts and keep them coherent. Never edit code.

**Store selection:** If the user names a store (a store is a standalone OpenSpec repo registered on this machine) or the work lives in one, run `openspec store list --json` to discover registered store ids, then pass `--store <id>` on the commands that read or write specs and changes (`new change`, `status`, `instructions`, `list`, `show`, `validate`, `archive`, `doctor`, `context`, `view`). Once selected, treat `--store <id>` as sticky for the rest of the workflow. Every unscoped example of those commands below is shorthand: before running it, append the flag.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous, run `openspec list --json` and ask the user to select one.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise infer from context, auto-select if only one active change exists, or ask the user to choose from recent active changes.

2. **Get the change's artifacts**
   ```bash
   openspec status --change "<name>" --json
   ```
   Use `schemaName`, `artifacts`, `isPlanningComplete`, `planningHome`, `changeRoot`, `artifactPaths`, and `actionContext` from the response. Edit only concrete files in `artifactPaths.<id>.existingOutputPaths`.

3. **Understand the request**

   If the user asked for a specific revision, apply that edit. If they asked for a coherence update, read the existing artifacts and check for contradictions, gaps, and duplication.

4. **Read and reconcile**

   Read the affected artifacts and any related existing artifacts. Apply the requested edit and update other existing artifacts only when needed for coherence.

5. **Confirm and apply one artifact at a time**

   Show each proposed revision and why. Write only after the user confirms unless the user already gave explicit edit authorization for the concrete change.

6. **Point to the next step**

   Missing artifacts -> continue artifact creation. Implemented changes that need code updates -> apply the change. Completed changes -> archive.

**Guardrails**
- Planning artifacts only. Never edit implementation code in this workflow.
- Use artifact IDs and paths from `openspec status`; do not assume hardcoded filenames.
- Edit only existing concrete artifact files.
- Do not create missing artifacts or new files under a glob artifact.
