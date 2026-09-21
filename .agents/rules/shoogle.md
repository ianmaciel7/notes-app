# Shoogle Component Discovery Rule

**Core Rule**: Always prefer searching and downloading existing shadcn/ui components, blocks, and templates via Shoogle over creating new UI components or layouts from scratch.

## Guidelines

1. **Search Before Building from Scratch**:
   - Before implementing any new UI primitive, section, or block (e.g., hero section, pricing table, authentication card, modal, data table, empty state, sidebar, stats widget), query the Shoogle MCP server tools:
     - `search_registry_items(query="<keyword>")`
     - `search_registry_items_scoped(query="<keyword>", registries=[...])`
   - Or use the CLI fallback:
     ```bash
     rtk pnpm dlx shadcn@latest search @shoogle <keyword>
     ```

2. **Download and Install via shadcn CLI**:
   - Download the desired component into the repository using the project package manager:
     ```bash
     rtk pnpm dlx shadcn@latest add <component-name-or-registry-url>
     ```

3. **Adapt to Repository Standards**:
   - After downloading, review the component against `.agents/rules/shadcn.md`:
     - Ensure Base UI compatibility (`render={<Button />}`, not `asChild`).
     - Use semantic tokens from `src/app/globals.css` (no hardcoded colors).
     - Use `lucide-react` icons with `data-icon` attributes.
     - Ensure dialogs/sheets/drawers have accessible titles.

4. **Exception**:
   - Only write UI from scratch if Shoogle yields no suitable community implementations or if the user explicitly specifies building custom markup from scratch.
