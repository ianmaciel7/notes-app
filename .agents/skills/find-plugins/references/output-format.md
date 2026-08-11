# Output Format

Use a concise ranked result set.

## Candidate format

```text
1. <Canonical Name>
   Platforms: <platforms>
   Type: <PLUGIN | EXTENSION | AGENT PLUGIN | MCP SERVER | AGENT SKILL | IDE EXTENSION>
   Publisher: <publisher>
   Trust: <OFFICIAL | VERIFIED_PUBLISHER | COMMUNITY | UNVERIFIED>
   Format: <VALID | INVALID | NOT_CHECKED>
   Compatibility: <summary>
   Found in: <catalogs>
   Original source: <original repository/vendor source>
   Why: <short reason>
```

Include `METADATA_MISMATCH` when applicable.

## Source coverage

At the end, include a compact factual summary:

```text
Source coverage
- Official sources searched: X
- Community/index sources searched: Y
- Unavailable: Z
- Not applicable: N
- Duplicate appearances merged: D
```

Only show counts that were actually tracked.

If an applicable source could not be searched, list it.

## If only community results exist

Say:

```text
No official or verified first-party match was found.
The following community candidates were discovered.
They were not downloaded, installed, or executed.
```

## If nothing is found

Say:

```text
No matching integration was found in the sources that were successfully searched.
Nothing was downloaded, installed, or executed.
```

## If web access is unavailable

Say:

```text
Current plugin availability cannot be safely verified because read-only access to the configured public sources is unavailable.
No guess was made and nothing was executed.
```

## Installation request

Only when the user explicitly asks how to install one specific result:
- re-verify the current original/official docs;
- show the native installation method as text;
- state `Not executed`;
- do not run it.
