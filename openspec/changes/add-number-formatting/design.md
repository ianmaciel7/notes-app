## Context

Formatting is schema/presentation metadata. A stored value of `1` must remain numerically equal to one whether displayed as `1`, `100%`, a currency amount, or a full progress bar.

## Model

`NumberPresentation` is a discriminated union:

- `number`: optional fixed decimal count;
- `percent`: optional fixed decimal count, where raw `1` displays as 100%;
- `currency`: ISO 4217 currency code and optional fixed decimal override;
- `progress`: positive integer steps, semantic color token, optional fixed decimals;
- `text`: table-cell-only mode for nonnumeric cell content.

Property definitions accept all except `text`. Table cells can use no format/text or numeric formats.

## Formatting Service

A pure formatter accepts raw value, presentation, locale, and fallback policy. It returns display text plus optional progress semantics. Parsing/editing remains locale-aware but stores a finite canonical number. Sorting, filters, grouping, formulas, and API/native export use raw values.

CSV/Markdown export has an explicit choice between raw and displayed values; the default is documented per export surface.

## Validation

Decimal count and progress steps are bounded. Currency uses an allowlisted/standards-based code validator. Non-finite values are rejected. Progress values outside expected range are clamped only visually when the contract says so; raw data remains unchanged and warnings are available.

## Migration

Existing number properties receive deterministic `number` presentation without changing values. Unknown formatting config falls back to number display and preserves diagnostics.

## UI

Property settings expose format-specific controls. Cards and views use one renderer. Progress includes accessible value text in addition to visual bar/color. Locale copy and separators follow current locale while stored numbers remain locale-neutral.

## Testing

Tests cover validation, locale formatting/parsing, percent semantics, currency, decimals, progress, raw sorting/filtering/formulas, migration, export, accessibility, and consistency across surfaces.
