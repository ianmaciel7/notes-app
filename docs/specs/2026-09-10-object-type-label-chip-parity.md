# Change Spec: object type label chip parity

## Problem

Capacities renders object type labels such as "Página" as a compact tone-colored chip with an icon, rounded border, and two measured sizes. The local workspace still renders individual object pages with a separate icon badge plus uppercase text, while card chips duplicate the markup privately.

## Scope

- In scope: shared object type label chip component, generic workspace object header usage, data-view card reuse, and Ladle story coverage for all object types.
- Out of scope: copying proprietary Capacities source, changing persisted object type metadata, implementing collections/backlinks logic, or changing the wider object page editor.

## Expected Behavior

All local object type labels can render through one reusable Capacities-style component. The default chip matches the object header scale measured from Capacities, and the compact chip matches related embed/card scale.

When the chip is used as an interactive control, it renders as a keyboard-reachable native button with hover/active affordance and the same trailing menu indicator seen in the Capacities object header reference. The Ladle gallery renders every object type through this interactive path and opens the same Popover-style object type selector pattern used by the local New action: search field, listbox rows, left object icons, right chevrons, and keyboard footer.

## Preserved Behavior

Existing object icon tone resolution, canonical study goal handling, workspace object list filtering, and card/list layouts remain unchanged.

## Interfaces and Dependencies

- `src/components/object-icons.tsx`
- `src/components/workspace-object-renderer.tsx`
- `src/components/workspace-object-data-view.tsx`
- `src/components/object-icons.stories.tsx`
- `src/components/workspace-object-renderer.stories.tsx`
- `CAPACITIES_COMPONENT_MAP.md`

## Acceptance Criteria

- [ ] Observable criterion: individual object pages show a tone-colored icon + text chip for their object type.
- [ ] Observable criterion: cards use the same shared chip component in compact scale.
- [ ] Observable criterion: Ladle exposes a gallery containing every object type chip.
- [ ] Observable criterion: Ladle object type label chips render their own object icons from `id` alone and open the shared local object type selector pattern on click without losing the Capacities chip geometry.
- [ ] Verification command: `pnpm test:unit src/components/object-icons.test.tsx src/components/workspace-object-renderer.test.tsx`
- [ ] Verification command: `pnpm lint`
- [ ] Verification command: `pnpm metrics`

## Test Strategy

Use static React markup tests for the reusable component contract and renderer integration, then browser-check the local app and Ladle story against the Capacities measurements.

## Risks and Reversal

UX risk is limited to object type label presentation. Reversal is deleting the new component/stories and restoring the previous inline icon-plus-text markup and card chip markup.
