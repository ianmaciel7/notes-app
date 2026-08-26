# Change 03: align-workspace-with-current-capacities report

## Status

Complete: 34/34 tasks have evidence. The finishing pass closed tasks 4.4, 4.5, 4.6, 5.6, and 5.8.

## Implementation evidence

- Added lifecycle contract markers to representative object page, property, attachment, projection, and view support surfaces while keeping values sourced from `objectLifecycleContractSlots`.
- Extended source checks to prove named production consumers for `ObjectCreationTrigger`, `ObjectCreationMenu`, `ObjectTypeOptionRow`, `ObjectCaptureSurface`, `ObjectEditorShell`, `EditableObjectTitle`, `EditableObjectBody`, `ObjectField`, `ObjectFieldGroup`, `ObjectValidationMessage`, `ObjectAttachmentControl`, `ObjectTab`, `ObjectProjectionRow`, `ObjectProjectionCard`, `ObjectCountBadge`, `ObjectTypePresetCard`, `ObjectTypeDetailsPanel`, `CustomObjectTypeForm`, and `ObjectIconTonePreview`.
- Added browser coverage for `Novo` trigger states, capture validation, attachment control, object type studio preset/custom states, projection rows/cards/counts, all direct `Novo` families, all preset-backed families, and a custom `Default` structure.
- Added a source ownership guard proving the finishing diff does not mutate block-editor document/body/storage-owned implementation paths.
- Reconciled the `ui/object-lifecycle` delta so strict OpenSpec validation preserves existing canonical scenarios replaced by the MODIFIED requirements.

## Verification

- PASS: `node --test tests/object-lifecycle-contracts.test.mjs tests/workspace-objects.test.mjs` (`25/25`).
- PASS: `PLAYWRIGHT_BASE_URL=http://localhost:3030 PLAYWRIGHT_PORT=3030 playwright test tests/e2e/workspace-parity.spec.ts -g "Novo trigger|every supported New family|preset and custom object families" --workers=1` (`3/3`).
- PASS: `PLAYWRIGHT_BASE_URL=http://localhost:3030 PLAYWRIGHT_PORT=3030 playwright test tests/e2e/workspace-parity.spec.ts --workers=1` (`18/18`).
- PASS: `biome ci src/components/object-view-support.tsx src/components/workspace-object-page-view.tsx tests/e2e/workspace-parity.spec.ts tests/object-lifecycle-contracts.test.mjs`.
- PASS: `openspec validate align-workspace-with-current-capacities --strict`.
- PASS: `git diff --check`.
- PASS: `pnpm verify` (`166/166` Node coverage tests plus production build).
- PASS: `Invoke-WebRequest -UseBasicParsing http://localhost:3030/pt-BR` returned `200 OK`.

## Notes

The implementation remains browser-local and does not copy authenticated Capacities account data. Archive remains deferred to the final completed-change archive pass.
