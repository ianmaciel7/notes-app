# Limitations

- This bundle confirms local acceptance evidence only where `local_status` is `passed`; it does not claim matched Capacities parity unless `reference_status` is `confirmed`.
- `Mod+P` is locally covered by the command router and unit contract, but the in-app browser did not reliably deliver `Ctrl+P` during the archived browser pass.
- Exact Capacities hover tone matching remains unconfirmed; local tests cover row activation and layout stability.
- IME behavior is covered locally, while authenticated reference mutation was not attempted.
- Reduced-motion and responsive-containment behavior are locally covered by source/unit contracts, not by a matched authenticated reference pass.
- Repository verification is green on the final current-workspace pass: `pnpm.CMD verify` completed format, lint, complexity, typegen, typecheck, coverage, and build.
- A pre-existing staged `src/components/block-editor.tsx` diff touching editor persistence/focus semantics remains outside this evidence bundle's parity claim and should be confirmed before archive/commit.

