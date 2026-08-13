# Shadcn First

- For UI work, always prefer project components and shadcn/ui components over raw HTML controls or custom component markup.
- Before creating new UI components, primitives, blocks, or complex custom markup, check existing project components first.
- Prefer existing project components, then official shadcn/ui components, then configured registries, then trusted registry components, then composition of existing primitives.
- Search by functionality and synonyms before custom-building, such as `command palette`, `cmd menu`, `combobox`, and `autocomplete`.
- Inspect candidate component docs and source before adding them.
- Do not install third-party registry components blindly; review dependencies, imports, accessibility, compatibility, maintenance, and license first.
- Create raw HTML controls or custom UI only when existing project/shadcn components cannot satisfy the requirement through reasonable composition or customization.
- When raw HTML or custom UI is necessary, record why the shadcn-first path was insufficient in the relevant OpenSpec change or completion summary.
