# Code Quality Metrics

Structural quality and maintainability metrics use an explicit local-only flow.
Biome is the sole analyzer in this flow. The installed version and configuration
are pinned by `package.json`, `pnpm-lock.yaml`, and `biome.json`.

## Commands

| Command | Behavior |
| --- | --- |
| `pnpm metrics` | Run selected Biome lint rules and fail on errors or warnings. |
| `pnpm metrics:report` | Validate reporter JSON and save raw and summarized reports. |

These commands do not run formatting, tests, coverage, security analysis, builds,
Git hooks, CI, or branch comparisons. The source scope comes from `biome.json`.
The reports are saved to `reports/code-quality-metrics/biome-latest.json` and
`reports/code-quality-metrics/latest.json`, which remain local artifacts.

## Selected Rules

| Biome rule | Configured limit | Meaning |
| --- | --- | --- |
| `complexity/noExcessiveCognitiveComplexity` | 15, error | Native cognitive-complexity threshold per function. |
| `complexity/useMaxParams` | 4, warning | Parameter-count threshold per function or method. |
| `complexity/noExcessiveLinesPerFunction` | 80, error | Function-body size, excluding blank lines. |
| `style/noExcessiveLinesPerFile` | 600, warning | File size, excluding blank lines. |

`biome.json` owns thresholds; `scripts/quality/biome-metrics-core.mjs` owns the
selected rule identities and derives reporter categories/support entries from
them. Do not maintain parallel category lists. `--error-on-warnings` makes the
metrics command stricter than ordinary lint without changing lint severity.

## Reporting Contract

The aggregate is named **Occurrences of the selected Biome maintainability rules**.
It counts emitted diagnostics in those four categories, not every quality issue,
not remediation effort, and not metric values for functions that produced no
threshold diagnostic. All diagnostics remain in the report, including parser
failures; the aggregate must not hide them.

The CLI invokes the installed Biome JavaScript launcher with Node directly, not a
shell command or platform-specific `.cmd` shim. It keeps stdout and stderr
separate, validates numeric summary counters and diagnostic records, preserves
nonzero exit codes, and refuses malformed reports. Reports with failing summaries
cannot become successful merely because the child returned exit code zero.
The capture buffer is bounded; exceeding it is an explicit failure, not a partial
clean report. The Biome JSON reporter is experimental and must be revalidated
when its schema changes.

## Support Matrix

| Metric | Unit | Support and limitation |
| --- | --- | --- |
| Cognitive complexity | Function | Native threshold diagnostic; not cyclomatic, perceived complexity, or WMC. |
| Parameter count | Function/method | Native threshold diagnostic; not local-variable count or API quality. |
| Lines per function | Function | Native threshold diagnostic; not responsibility or cohesion. |
| Lines per file | File | Native threshold diagnostic; not module/package architecture. |
| ABC size | Function/method | NOT MEASURED. Requires a defined assignments/branches/conditions counter. |
| Perceived complexity | Function/method | NOT MEASURED. RuboCop's metric is not Biome cognitive complexity. |
| Local-variable count | Function/method | NOT MEASURED. Unused-variable diagnostics are not a total count. |
| Methods or attributes per class | Class | NOT MEASURED. Constructor, accessor, inheritance, and field policies would be needed. |
| Overloads per method | TypeScript function/method | NOT MEASURED. Do not count overload signatures using regular expressions. |
| Fan-in / fan-out | File/module/package | NOT MEASURED. Import-line counts are not resolved dependency counts. |
| Afferent / efferent coupling (Ca / Ce) | Package/module | NOT MEASURED. Requires explicit boundaries and a dependency graph. |
| Instability (I) | Package/module | NOT MEASURED. Requires Ca and Ce and a zero-denominator policy. |
| Abstractness (A) | Package/module | NOT MEASURED. Do not invent interfaces to improve a score. |
| Main-sequence distance (D) | Package/module | NOT MEASURED. A and I are unavailable. |
| Relational cohesion (H) | Module/package | NOT MEASURED. Requires a relationship model and selected formula. |
| CBO | Class | NOT MEASURED. Requires resolved class coupling. |
| WMC | Class | NOT MEASURED. Do not relabel summed cognitive complexity as WMC. |
| RFC | Class | NOT MEASURED. Requires a resolved response/call set. |
| NOC | Class | NOT MEASURED. Applies to real inheritance hierarchies only. |
| LCOM / LCOM-HS | Class | NOT MEASURED. Requires a specified variant and attribute-access model. |
| TCC / LCC | Class | NOT MEASURED. Requires direct/indirect method-connection analysis. |
| Technical Debt Ratio | Project | NOT MEASURED. No remediation/development cost model is configured. |
| Maintainability Rating | Project | NOT MEASURED. Do not derive A–E ratings from diagnostic counts. |

Architectural import/cycle rules, when enabled, are checks named after their rules,
not measurements of Ca, Ce, CBO, fan-in, or fan-out. Class-based metrics apply only
to actual classes; this predominantly functional React codebase must not be
restructured into classes for a metric.

## Qualitative Review and Tests

AI review may identify mixed responsibilities, duplication, and oversized code
with file and location evidence. Keep that analysis separate from the automated
report and do not assign unmeasured scores or percentages.

Run `node --test scripts/quality/biome-metrics.test.mjs` to test the CLI's reporting
and failure behavior with synthetic reporter fixtures. Passing these tests does
not mean the real application's Biome checks pass.

## Official References

- https://biomejs.dev/linter/javascript/rules/
- https://biomejs.dev/linter/rules/no-excessive-cognitive-complexity/
- https://biomejs.dev/linter/rules/use-max-params/
- https://biomejs.dev/linter/rules/no-excessive-lines-per-function/javascript/
- https://biomejs.dev/linter/rules/no-excessive-lines-per-file/javascript/
- https://biomejs.dev/reference/cli/
