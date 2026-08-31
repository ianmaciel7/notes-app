# Limitations

- This bundle confirms local acceptance evidence only where `local_status` is `passed`; it does not claim matched Capacities parity unless `reference_status` is `confirmed`.
- `Mod+P` is locally covered by the command router and unit contract, but the in-app browser did not reliably deliver `Ctrl+P` during the archived browser pass.
- Exact Capacities hover tone matching remains unconfirmed; local tests cover row activation and layout stability.
- IME behavior is covered locally, while authenticated reference mutation was not attempted.
- Reduced-motion and responsive-containment behavior are locally covered by source/unit contracts, not by a matched authenticated reference pass.
- Repository verification is not green: format and complexity checks fail, typegen/build were blocked by environment constraints, and `pnpm.cmd verify` stops at formatting.

