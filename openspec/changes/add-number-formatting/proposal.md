## Why

Number properties currently store numeric values without a complete presentation contract. Current documentation supports number, progress, percent, and currency formats, fixed decimals, progress steps/color, and table-cell text/none behavior. Formatting must remain presentation metadata rather than changing canonical numeric meaning.

## What Changes

- Add validated number presentation metadata for number, percent, currency, and progress.
- Add fixed decimal configuration, currency code, progress steps, and progress color.
- Permit `none/text` only for table cells, not typed number properties.
- Apply locale-aware display consistently in properties, cards, table views, Table Blocks, queries, sorting, export, and formulas.
- Preserve raw numeric values for comparisons and calculations.
- Add safe migration, invalid-config fallbacks, and accessibility semantics.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `domain/typed-property-values`: Add number-presentation definitions, validation, migration, and raw/display separation.
- `ui/object-views-and-conversion`: Render and edit number formats consistently across projections.

## Impact

- Property definitions, view configuration, renderers, Table Blocks, export, formulas, localization, migrations, and tests.
