# External Knowledge Base Snapshots

These JSON files are graphable reference corpora used to validate product
decisions and OpenSpec work. They are source material, not application data,
executable configuration, or product requirements by themselves.

## Sources

- `readwise.json`: Readwise and Reader help-center knowledge graph source.
- `capacities.json`: Capacities documentation knowledge graph source.
- `obsidian.json`: Obsidian help knowledge graph source.

Each JSON uses `schema: graphify_knowledge_source.v1` and contains:

- `graph.nodes`: reference entities, features, workflows, and the source root.
- `graph.edges`: Graphify-style relationships between the source and concepts.
- `product_boundary`: how to use the source without copying vendor-specific
  product decisions into this application.
- `graphify_index_text`: the Markdown index text used for Graphify extraction.
- `source_snapshot`: the original imported dataset preserved for auditability.

The snapshots are kept separate from `docs/product/` so that external product
behavior is not mistaken for this application's contract. Product decisions
must be distilled into product documents or OpenSpec changes with explicit
evidence and scope.
