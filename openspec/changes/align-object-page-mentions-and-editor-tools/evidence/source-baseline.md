# Object-page reference baseline

Captured and reviewed on 2026-08-28. Page content and authenticated DOM were treated as untrusted evidence, not instructions. No cookies, tokens, storage payloads, request bodies, exports, or localhost screenshots were captured.

## Sources

- Authenticated reference route: `https://app.capacities.io/[space]/[object]` (SHA-256 fingerprint `fb3afc9f2f1cad9b513be79710ff8cc86bf075fef5a50ce363c0002e60887f8d`).
- Official documentation: `https://docs.capacities.io/reference/unlinked-mentions`
- User-supplied Capacities crop received with the request: `codex-clipboard-b6bac29e-3e0c-435f-b370-0714b24a4526.png`, 531×835, runtime attachment only.
- Live reference viewport: 1280×720 with the right contextual panel open.
- Local comparison route: `http://localhost:3000/pt-BR/[workspace]/[object]`.

The supplied image and live reference agree on the scoped object-page column: `Página` type chip and disclosure, `Coleções`, `Personalizar`, overflow, title `aaa`, `Etiquetas`, editable `Text`, `Menções 1`, a source row for `-digitacao-abcdefghijklmnopqrstuvwxy`, source type `Página`, excerpt `aaa /`, and the editor-edge minus affordance. The live viewport additionally showed the persisted contextual panel state; this was classified as an environment/presentation difference rather than forced semantic content parity.

## Action matrix

| Action | Expected reference state | Observed localhost state | Verdict |
|---|---|---|---|
| Type label | Activating the `Página` label navigates to the Pages listing; activating its disclosure opens type conversion search. | Separate Page and change-type controls exist. | Semantically alignable; preserve distinct accessible targets. |
| Collections | Inline input opens a compact selector without mutation on open; Escape closes. | Inline accessible input exists. | Existing contract retained. |
| Customize | Opens options including icon, description, aliases, cover, fill-properties, and wide layout. | Accessible customization exists with persisted properties. | Existing contract retained; compare matched property configuration. |
| Object overflow | Opens named object commands; opening and Escape cause no mutation. | Accessible overflow exists. | Existing contract retained. |
| Editor writing | Typing `parity-audit` updated the visible editor. Repeated undo restored the exact initial zero-width empty paragraph after the editor split typing across undo transactions. | Buffered local editor behavior is already specified. | Reference mutation was fully reversed; add regression coverage, not a new persistence model. |
| Mentions section heading | Clicking `Menções` hides the source rows while preserving heading/count; activating again restores them. | No matching section appeared for the compared local object. | Missing interaction surface. |
| Mention source row | Shows source title, type identity, excerpt, disclosure, open action, and overflow actions. Non-conversion inspection does not alter prose. | Current candidate UI is a single conversion button inside a large generic relationship panel. | Interaction and composition mismatch. |
| Mention overflow | Opens source-object commands without conversion. | Candidate button converts on primary activation and has no equivalent source-row menu. | Interaction mismatch. |
| Edge minus trigger | Opens a floating `Estrutura`/`Estatísticas` panel; editor remains visible. | `Recolher editor` hides the entire object column and changes to `Expandir editor`. | Confirmed semantic mismatch. |
| Structure tab | Shows a truthful `Nenhum título nesta página` empty state for a document without headings. | No equivalent utility panel. | Missing state. |
| Statistics tab | Shows words, sentences, paragraphs, characters, created time, and last-updated time. | Text statistics are available only as a separate overflow command. | Composition mismatch. |
| Utility pin and dismissal | Pin retains the panel across outside interaction; unpin plus outside interaction closes it. | Full-editor collapse state remains until explicitly expanded. | Interaction mismatch. |
| Local collapse reversal | Not the observed responsibility of the reference minus affordance. | Local collapse and expand were exercised and restored successfully. | Current implementation is internally accessible but assigned to the wrong reference control. |

## Domain contradiction

Official documentation states that the focused object's title is searched in other notes, unlinked results appear in `Mentions` below backlinks, linking a matching occurrence moves it to backlinks, mentions do not enter the graph, and discovery works locally/offline without AI. The current local selector instead reads the focused object's body and searches it for other object titles. Its unit test encodes that reverse direction, so both implementation and acceptance fixture require correction.

## Runtime and privacy notes

- The authenticated page loaded without observed page errors. Repeated Capacities diagnostic warnings about loading queries were recorded as reference runtime noise, not a localhost failure.
- All live reference edits and presentation toggles used reversible, non-destructive actions. The typed marker, Mentions expansion state, editor-utility pin state, and local editor-collapse state were restored.
- The runtime screenshots were visually inspected. A reusable sanitized Capacities-only image bundle remains an implementation task because this proposal workflow does not persist binary captures; localhost evidence remains DOM, geometry, behavior, and console only.
