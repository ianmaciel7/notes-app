## Purpose

Define durable repository governance requirements for agent work, canonical documentation ownership, environment assumptions, framework-specific documentation checks, component discovery, research separation, dependency inspection, and protected local directories.

## Requirements

### Requirement: Environment Contract
Agents and contributors SHALL follow the repository environment contract when running commands or documenting examples.

#### Scenario: Running local commands
- **WHEN** a task requires shell commands in this repository
- **THEN** the agent SHALL work from WSL2 using Linux paths and shell assumptions unless native Windows behavior is required
- **AND** package-manager commands SHALL use pnpm 11.20.0

#### Scenario: Writing PowerShell examples
- **WHEN** documentation or guidance uses PowerShell examples
- **THEN** the examples SHALL avoid Bash-style `\` line continuation

### Requirement: Canonical Documentation Ownership
Repository guidance SHALL preserve canonical ownership boundaries across the documented source files.

#### Scenario: Workflow or release guidance is needed
- **WHEN** work involves setup, commands, Git, commits, pull requests, CI, merge behavior, versioning, tags, or releases
- **THEN** `CONTRIBUTING.md` SHALL be treated as the canonical source

#### Scenario: Security or deployment guidance is needed
- **WHEN** work involves security, secrets, or dependency review
- **THEN** `SECURITY.md` SHALL be treated as the canonical source
- **AND** deployment triggers, environment promotion, deployment verification, and rollback behavior SHALL be owned by `docs/DEPLOYMENT.md`

#### Scenario: Architecture, design, testing, or context guidance is needed
- **WHEN** work involves architecture, design, testing, or agent context efficiency
- **THEN** the agent SHALL use `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/TESTING.md`, or `docs/AGENT_CONTEXT_EFFICIENCY_AUDIT.md` according to the topic

### Requirement: Next.js Version-Specific Documentation
Agents SHALL verify relevant installed Next.js documentation before changing framework APIs, routing, caching, or file conventions.

#### Scenario: Next.js framework behavior changes
- **WHEN** a task touches Next.js API usage, routing, caching, or file-convention behavior
- **THEN** the agent SHALL read the relevant guide in `node_modules/next/dist/docs/` after dependencies are installed
- **AND** the agent SHALL heed deprecation notices from the installed version

#### Scenario: Generated agent rules are present
- **WHEN** `next dev` adds or updates the generated Next.js agent-rules block
- **THEN** the block SHALL be preserved rather than removed only to make a diff smaller

### Requirement: Generated Output Protection
Agents SHALL avoid manual edits to generated output and durable build artifacts.

#### Scenario: Generated files are encountered
- **WHEN** files such as `.next/`, `next-env.d.ts`, or `tsconfig.tsbuildinfo` are present
- **THEN** the agent SHALL NOT edit them manually

### Requirement: Pointer File Consistency
Agent pointer files SHALL remain lightweight pointers to the canonical agent instructions.

#### Scenario: Updating agent instructions
- **WHEN** `AGENTS.md` changes in a way that affects Claude or Gemini entry points
- **THEN** `CLAUDE.md` and `GEMINI.md` SHALL remain pointers to `AGENTS.md`
- **AND** agent instructions SHALL NOT be duplicated into those files

### Requirement: Dependency Inspection Before Use
Agents SHALL inspect newly added libraries from the exact installed package before writing integration code.

#### Scenario: Adding a new library
- **WHEN** a new library is added
- **THEN** the agent SHALL inspect the installed package documentation, public exports, TypeScript declarations, changelog or migration notes, and relevant `AGENTS.md` or `SKILL.md` files when available
- **AND** installed-version documentation SHALL be preferred over remembered APIs

#### Scenario: Library documentation is unavailable
- **WHEN** installed package documentation is unavailable
- **THEN** the agent SHALL verify behavior from public types and implementation before writing integration code

### Requirement: Component Discovery Before Custom UI
Agents SHALL perform component discovery before creating new UI components, primitives, blocks, or complex custom markup.

#### Scenario: New UI component is needed
- **WHEN** work requires a new UI component, primitive, block, or complex custom markup
- **THEN** the agent SHALL inspect current project component configuration with `pnpm dlx shadcn@latest info --json`
- **AND** the agent SHALL check existing project components before writing custom UI

#### Scenario: Searching registries
- **WHEN** existing project components do not satisfy the need
- **THEN** the agent SHALL search shadcn registries by functionality and synonyms using `pnpm dlx shadcn@latest search`
- **AND** candidate components SHALL be inspected with documentation or source before adoption

#### Scenario: Third-party registry component is considered
- **WHEN** a third-party registry component is considered
- **THEN** the agent SHALL review source code, dependencies, package scripts, imports, accessibility, compatibility, maintenance, and license
- **AND** the agent SHOULD preview third-party changes with dry-run or view commands when possible

### Requirement: Markdown Path Portability
Markdown files SHALL use portable relative paths for repository links and references.

#### Scenario: Writing Markdown links
- **WHEN** a `.md` file links to or references another repository file
- **THEN** the path SHALL be relative to that Markdown file
- **AND** absolute, `file://`, or OS-specific paths SHALL NOT be hardcoded

### Requirement: User Scratch Directory Protection
The repository SHALL protect `docs/temp/` as a user-maintained scratch and drafting area.

#### Scenario: Reorganizing or cleaning docs
- **WHEN** documentation files are reorganized, cleaned, or archived
- **THEN** `docs/temp/` and files inside it SHALL NOT be deleted, moved, or renamed

### Requirement: Research Separation
Product research and reconstruction evidence SHALL stay separate from canonical requirements and proposals.

#### Scenario: Capturing competitor or reference-app research
- **WHEN** long-lived research knowledge is collected
- **THEN** it SHALL be stored under `docs/research/`
- **AND** facts SHALL be labeled as `CONFIRMED`, `INFERRED`, or `UNKNOWN`

#### Scenario: Referencing research from OpenSpec
- **WHEN** OpenSpec proposals need research context
- **THEN** they SHALL link to relevant `docs/research/` files through relative Markdown links
- **AND** they SHALL NOT duplicate research dumps into `openspec/specs/` or proposal files

### Requirement: MCP Recommendation Boundaries
Generic MCP server recommendations SHALL be stored without secrets in the repository-owned recommendation file.

#### Scenario: Recording MCP recommendations
- **WHEN** a generic MCP server recommendation is documented
- **THEN** it SHALL be stored in `.agents/mcp-servers.json`
- **AND** secrets SHALL NOT be stored there
