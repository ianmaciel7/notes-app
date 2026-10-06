# Firebase UI GritQL Guards

This directory contains rules that enforce Firebase UI component patterns and correct usage.

## Active guard areas

The current pack covers:

- Firebase UI import patterns and canonical sources;
- validation that Firebase components are used from their official packages.

## Ownership rule

Use GritQL only for mechanically reliable consumption rules.

Leave these to their stronger owners:

- Firebase SDK configuration -> Firebase SDK;
- TypeScript correctness -> TypeScript;
- component implementation details -> Firebase UI source;
- accessibility -> Biome/browser tests.
