---
name: context7-mcp
description: Fetch current library documentation with Context7 MCP tools.
---

# Context7 MCP

Use Context7 MCP to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. This includes API syntax, configuration, version migration, library-specific debugging, setup instructions, and CLI tool usage. Use even when you think you know the answer — your training data may not reflect recent changes. Prefer this over web search for library docs.

Do not use for: refactoring, writing scripts from scratch, debugging business logic, code review, or general programming concepts.

## Best Practice Workflow

### 1. Resolve Library ID (`resolve-library-id`)

- Always call `resolve-library-id` first unless a verified `/org/project` ID is already available.
- Use the official library name with exact casing and punctuation (e.g., `"Next.js"` not `"nextjs"`, `"Tailwind CSS"` not `"tailwind"`, `"Base UI"` not `"baseui"`).
- Pick the best match by evaluating:
  1. Exact name match;
  2. Description relevance;
  3. Code snippet count;
  4. Source reputation (High/Medium preferred);
  5. Benchmark score (higher is better);
  6. Pinned version match when applicable (e.g., `/vercel/next.js/v16.3.8`).

### 2. Query Documentation (`query-docs`)

- Scope each query to a single concept or feature.
- Use specific, descriptive queries (e.g., `"revalidateTag profile argument syntax"`) rather than single ambiguous keywords.
- Do NOT combine disparate concepts into one call (e.g., avoid `"routing, auth, and cache"`); multi-concept queries dilute ranking and produce shallow responses. If a task spans multiple topics, make separate, focused calls.
- Enforce token economy: run a maximum of 2–3 queries per question.
- Never include credentials, API keys, passwords, or sensitive code in query strings.

### 3. Tool Access Modes

- **MCP Tools (Preferred)**:
  - `resolve-library-id`: resolve library identifier.
  - `query-docs`: fetch relevant documentation chunks.
- **CLI Alternative**:
  - `npx ctx7@latest library <name> "<intent>"`
  - `npx ctx7@latest docs <libraryId> "<intent>"`

### 4. Quota and Fallback Handling

- If a quota or authentication error occurs, report it clearly and suggest logging in with `npx ctx7@latest login` or configuring `CONTEXT7_API_KEY`.
- Do not silently fall back to outdated or hallucinated training data.

See [../../rules/context7.md](../../rules/context7.md) and
[../../rules/token-economy.md](../../rules/token-economy.md).
