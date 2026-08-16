## Reverse-Engineering Capture Runbook (Local)

Use `pnpm reverse:capture` to collect deterministic, structured evidence for routes.

- Output root:
  - `reverse-engineering/capture/runs/<runId>/`
- Per route artifacts:
  - `<route>-loaded.png` (screenshot)
  - `<route>-capture.json` (record summary)
  - `<route>-network.jsonl` (request/response list)
  - `<route>-aria.json` (accessibility state snapshot)
- Capture index:
  - `reverse-engineering/capture/index.jsonl`
- Run metadata:
  - `reverse-engineering/capture/runs/<runId>/run.json`
  - `reverse-engineering/capture/runs/<runId>/observations.json`

Environment overrides:
- `REENGINEERING_BASE_URL` (default `http://localhost:3000`)
- `REENGINEERING_VIEWPORT_WIDTH` (default `1128`)
- `REENGINEERING_VIEWPORT_HEIGHT` (default `912`)

