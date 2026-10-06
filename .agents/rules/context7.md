# Rule: Context7 Best Practices for Documentation Lookup

## Description

Enforce high-accuracy, token-efficient, and privacy-safe documentation queries using Context7 MCP and CLI tools. Agents must prioritize official, up-to-date third-party documentation over generic web searches and training-data assumptions.

## Mandatory Guidelines

### 1. When to Use vs When to Avoid

- **MUST USE**:
  - Investigating third-party libraries, frameworks, SDKs, CLIs, and cloud services (e.g., Next.js 16, React 19, Tailwind CSS v4, Base UI, Biome, Vitest).
  - API signatures, configuration schemas, breaking changes, and version migration guides.
  - Library-specific error diagnosis or setup commands.
- **DO NOT USE**:
  - Debugging project-specific business logic or internal repository modules.
  - General programming algorithms or vanilla language questions.
  - Code refactoring, code review, or writing scripts from scratch.

### 2. Resolution Strategy (`resolve-library-id`)

1. **Official Library Name**:
   - Query using the exact official name and punctuation (e.g., `"Next.js"` not `"nextjs"`, `"Tailwind CSS"` not `"tailwind"`, `"Base UI"` not `"baseui"`).
2. **Select the Best Match (`/org/project`)**:
   - Prioritize exact name matches, high code snippet count, High/Medium source reputation, and higher benchmark scores.
   - For pinned versions, select version-specific IDs when available (e.g., `/vercel/next.js/v16.3.8`).
3. **Fallback Rephrasing**:
   - If initial resolution returns poor relevance, refine the query or alternate project naming before giving up.

### 3. Documentation Query Strategy (`query-docs`)

1. **Single-Concept Scoping**:
   - Keep each `query-docs` call scoped to a single concept or feature.
   - Do NOT combine disparate topics into one query (e.g., avoid "cache and routing and auth" — multi-topic queries dilute ranking).
   - If a problem spans multiple topics, make separate, focused calls with the resolved library ID.
2. **Specific and Descriptive Queries**:
   - Use concrete questions and descriptive phrases (e.g., `"revalidateTag profile argument signature"` rather than single words like `"revalidate"`).
3. **Free Tier & Quota Conservation**:
   - Context7 operates in **Free Tier mode** by default with zero configuration or paid API keys required.
   - Limit calls to a maximum of 2–3 targeted queries per task to stay well within free community quotas.
   - If a quota limit is ever reached, notify the user without silently falling back to hallucinated training data.

### 4. Privacy & Security Safeguards

- Never include sensitive project information, private API keys, environment credentials, database connection strings, or internal paths in search queries.

### 5. Tool Hierarchy

- **MCP Tools First**:
  - `call_mcp_tool` with `ServerName: "context7"`, `ToolName: "resolve-library-id"`
  - `call_mcp_tool` with `ServerName: "context7"`, `ToolName: "query-docs"`
- **CLI Fallback**:
  - `npx ctx7@latest library <name> "<intent>"`
  - `npx ctx7@latest docs <libraryId> "<intent>"`

See [./token-economy.md](./token-economy.md) and
[../../AGENTS.md](../../AGENTS.md).
