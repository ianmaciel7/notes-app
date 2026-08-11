## Why

The object model is the product domain backbone. It should be specified separately from UI shells, visual effects, editor rendering, search, graph, and AI.

## What Changes

- Define unique object identity for ideas and notes instead of file-folder records.
- Define typed extensible objects with examples such as Pessoa, Reuniao, and Livro.
- Define editable custom metadata by object type.
- Define object type schema versioning and migration behavior.
- Define durable authorized mutations and revision behavior.
- Define safe object creation and built-in type behavior.
- Define the complete object action surface.

## Impact

- Planning only; no runtime code changes in this change.
- Later editor, collections, search, graph, AI, and portability changes depend on this domain model.
