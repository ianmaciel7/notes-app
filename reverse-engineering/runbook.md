# Reverse-Engineering Evidence Cycle

## 1) Discover
- Open Capacities route list and all `/tipos/*` states at canonical viewport(s).
- Open local app at `http://localhost:3000` and switch the same routes.

## 2) Record
- Persist structured artifacts under each domain:
  - `reference/*`, `local/*`, `pages/*`, `states/*`, `flows/*`, `network/*`, `styles/*`, `components/*`, `tokens/*`, `screenshots/*`, `accessibility/*`, `comparisons/*`, `knowledge/*`.
- Keep every new file as JSON/YAML/JSONL.

## 3) Structure evidence
- Update:
  - `reverse-engineering/manifest.json`
  - `reverse-engineering/manifests/reverse-engineering-manifest.yaml`
  - `reverse-engineering/evidence-catalog.jsonl`

## 4) Query existing knowledge
- Consult:
  - `reverse-engineering/evidence-catalog.jsonl`
  - `reverse-engineering/knowledge/knowledge-graph.json`
  - `reverse-engineering/knowledge/state-events.json`

## 5) Derive requirements
- Update:
  - `reverse-engineering/comparisons/acceptance-criteria.json`
  - `reverse-engineering/comparisons/gaps.json`
  - `reverse-engineering/comparisons/confidence-matrix.json`

## 6) Implement
- Use OpenSpec for requirements and implementation contracts.

## 7) Reproduce in local
- Validate route parity, state transitions, and interaction classes.

## 8) Store results
- Save screenshots / diffs into `reverse-engineering/screenshots/`.
- Update `reverse-engineering/comparisons/coverage-report.json`.

## 9) Refresh Graph
- `graphify extract . --no-gitignore --code-only --force --out .`
- `graphify cluster-only .`

## 10) Next delta
- Re-open `gaps.json` and close the highest-priority unknowns first.

## 11) Capture artifact schema
- Emit capture records following:
  - `reverse-engineering/capture/observations.schema.json`
- Track each capture with one record file per run and persist references in:
  - `reverse-engineering/capture/index.jsonl`
  - `reverse-engineering/accessibility/keyboard-matrix.json`
  - `reverse-engineering/network/interaction-requests.json`
  - `reverse-engineering/comparisons/coverage-report.json`

## 12) Automated local evidence capture
- Run:
  - `pnpm reverse:capture` (local routes only)
- Output:
  - `reverse-engineering/capture/runs/<runId>/...`
  - `reverse-engineering/capture/index.jsonl` entries are appended automatically
  - screenshots to `reverse-engineering/screenshots/`
