## Why

The current roadmap and source inventory predate the latest Capacities documentation corpus and the latest `dev` implementations. The project reference inventory records 154 Capacities documentation URLs, while the current official list contains 196 pages. The roadmap also presents several already implemented and archived foundations as future work.

## What Changes

- Establish a canonical, dated Capacities source inventory using the current official machine indexes and the project archives.
- Classify evidence as official documentation, authenticated observation, sanitized archive evidence, local code/test evidence, inference, or unknown.
- Publish an implemented/active/missing/intentional-divergence matrix for `dev`.
- Refresh `CAPACITIES_PARITY_ROADMAP.md` so dependencies and priorities match the current repository.
- Require every future parity change to reconfirm reference files and current official pages before implementation.
- Preserve archive limitations: response payload coverage does not imply bit-for-bit WACZ reconstruction or access to private implementation details.

## Capabilities

### New Capabilities

- `docs/capacities-reference-baseline`: Defines source inventory, provenance, freshness, divergence classification, and roadmap update rules.

### Modified Capabilities

None.

## Impact

- Documentation, evidence indexes, OpenSpec planning, and contributor guidance.
- No production feature behavior or third-party data is changed.
