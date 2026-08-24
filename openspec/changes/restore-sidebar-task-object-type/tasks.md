## 1. Reference and scope

- [x] 1.1 Confirm from the supplied Capacities reference that Task belongs inside `Object types`, after Table and before Weblink.
- [x] 1.2 Save the supplied reference image under `docs/references` with provenance notes.

## 2. Implementation

- [x] 2.1 Add a pure helper that reconciles current protected Structures with a stored registry.
- [x] 2.2 Apply reconciliation during workspace snapshot hydration.
- [x] 2.3 Preserve stored custom and legacy Structures without recreating absent optional legacy presets.

## 3. Tests

- [x] 3.1 Add focused unit coverage for required-Structure reconciliation.
- [x] 3.2 Add storage migration coverage proving Task is restored in canonical order.
- [x] 3.3 Run the focused helper test and TypeScript syntax execution locally.

## 4. Repository validation

- [ ] 4.1 Run the complete `pnpm verify` suite in a full development checkout or CI.
- [ ] 4.2 Sync the finalized delta into canonical specs and archive this change after full verification.
