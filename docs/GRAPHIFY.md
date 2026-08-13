# Graphify Infrastructure

## Current State

Graphify is partially configured in the current branch.

Validated local CLI:

- `graphify 0.9.41`

Generated artifacts:

- `graphify-out/graph.json`
- `graphify-out/graph.html`
- `graphify-out/GRAPH_REPORT.md`
- `graphify-out/manifest.json`
- `graphify-out/.graphify_root`

Local cache and intermediate analysis files are intentionally ignored.

Current graph scope:

- Built with `graphify extract . --code-only`.
- Reclustered with `graphify cluster-only . --no-label`.
- Covers code/config files only.
- Skips docs and images because semantic extraction needs an LLM backend.

Current graph stats:

- 1032 nodes
- 956 edges
- 111 communities
- 0 input tokens
- 0 output tokens

Integrity check:

- `graphify diagnose multigraph --graph graphify-out\graph.json`
- 0 missing endpoint edges
- 0 dangling endpoint edges
- 0 self-loop edges
- 0 duplicate edges
- 0 same-endpoint collapse groups

## Known Limitations

The full `graphify .` run is currently blocked by the local environment:

```text
OLLAMA_BASE_URL points at a link-local/metadata address ('0.0.0.0')
```

Graphify refuses to send corpus text to that address. Until `OLLAMA_BASE_URL` is corrected or another supported semantic backend is configured, use code-only graph updates and do not claim docs/images are represented in the graph.

The current branch still does not contain:

- installed Graphify Git hooks
- `scripts/check-graphify.mjs`
- `pnpm graphify:check`
- Graphify CI jobs

## Usage Policy

Use Graphify when `graphify-out/graph.json` is present and current. Source code remains authoritative.

For code-only updates after code/config changes:

```powershell
graphify update .
graphify cluster-only . --no-label
graphify diagnose multigraph --graph graphify-out\graph.json
```

For full semantic extraction, first fix the semantic backend environment and then rerun the full extraction. Do not hide semantic extraction cost or backend requirements in hooks or CI.

## Future Restoration

If Graphify automation is restored later, document and verify:

- `.graphifyignore`;
- installed hook status;
- generated artifact policy;
- merge-driver configuration;
- CI or local check scripts;
- semantic backend policy;
- failure behavior and recovery policy.
