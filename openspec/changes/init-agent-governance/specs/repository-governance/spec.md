## ADDED Requirements

### Requirement: Agent-Agnostic Configuration Ownership
Repository agent configuration MUST use `AGENTS.md` and `.agents/` as the canonical vendor-neutral source of truth.

#### Scenario: Storing reusable agent behavior
- **WHEN** project instructions, skills, rules, reusable workflows, subagent definitions, or portable MCP recommendations are stored in the repository
- **THEN** they MUST live under `AGENTS.md` or `.agents/`
- **AND** they MUST NOT be duplicated under vendor-specific project directories

#### Scenario: Retaining project skills
- **WHEN** a reusable project skill is retained in the repository
- **THEN** it MUST have exactly one canonical repository copy under `.agents/skills/<skill-name>/SKILL.md`

#### Scenario: Vendor-specific project directories are generated
- **WHEN** tools generate project-local `.agent/`, `.codex/`, `.gemini/`, or comparable vendor-specific directories
- **THEN** those directories MUST be treated as local tool configuration
- **AND** they MUST NOT duplicate portable repository instructions, skills, rules, workflows, or specs

### Requirement: Environment Contract
Agents and contributors MUST follow the repository environment contract when running commands or documenting examples.

#### Scenario: Running local commands as ianma
- **WHEN** a task requires shell commands on user or machine `ianma`
- **THEN** the agent MUST use native Windows PowerShell paths, commands, and assumptions by default
- **AND** the agent MUST NOT assume WSL2 is available unless explicitly requested or verified

#### Scenario: Writing PowerShell examples
- **WHEN** documentation or guidance uses PowerShell examples
- **THEN** the examples MUST avoid Bash-style `\` line continuation

### Requirement: OpenSpec Responsibility Boundary
Repository agent configuration MUST reference OpenSpec without replacing or duplicating it.

#### Scenario: Durable requirements are needed
- **WHEN** work needs durable requirements, behavior, acceptance criteria, design rationale, alternatives, or change lifecycle artifacts
- **THEN** the agent MUST use OpenSpec under `openspec/`
- **AND** `AGENTS.md` or `.agents/` MUST reference OpenSpec rather than duplicating specs

### Requirement: OpenSpec Change Gate
Agents MUST use OpenSpec before changing repository code or documentation.

#### Scenario: Changing code or documentation
- **WHEN** an agent plans to create, edit, delete, move, or restore repository code or documentation
- **THEN** the agent MUST first identify an existing active OpenSpec change that covers the work or create/update one under `openspec/changes/`
- **AND** the change MUST describe the intended scope before implementation begins

#### Scenario: Tiny mechanical correction
- **WHEN** the work is a tiny mechanical correction that does not change durable behavior, architecture, workflow, or documentation meaning
- **THEN** the agent MAY use the current active OpenSpec change as the scope record
- **AND** the agent MUST still mention that OpenSpec coverage in the completion summary

#### Scenario: Work discovers a new durable decision
- **WHEN** implementation or documentation work reveals a durable requirement, behavior, acceptance criterion, rationale, alternative, or trade-off
- **THEN** the agent MUST update the relevant OpenSpec artifact before claiming the work is complete

### Requirement: MCP Recommendation Boundaries
Generic MCP server recommendations MUST be stored without secrets in the repository-owned recommendation file.

#### Scenario: Recording MCP recommendations
- **WHEN** a generic MCP server recommendation is documented
- **THEN** it MUST be stored in `.agents/mcp-servers.json`
- **AND** secrets MUST NOT be stored there

#### Scenario: Verifying MCP or plugin parity
- **WHEN** `.agents/mcp-servers.json` is used to configure a client or compare plugin coverage
- **THEN** configuration parity MUST NOT be treated as a healthy runtime connection
- **AND** the active client or plugin tools MUST be verified separately

### Requirement: Markdown Path Portability
Markdown files MUST use portable relative paths for repository links and references.

#### Scenario: Writing Markdown links
- **WHEN** a `.md` file links to or references another repository file
- **THEN** the path MUST be relative to that Markdown file
- **AND** absolute, `file://`, or OS-specific paths MUST NOT be hardcoded

### Requirement: Shadcn-First UI Composition
Agents MUST prefer existing project components and shadcn/ui components over raw HTML controls or custom UI markup for UI work.

#### Scenario: UI component work is needed
- **WHEN** an agent creates or changes UI components, primitives, blocks, controls, dialogs, navigation, forms, or complex custom markup
- **THEN** the agent MUST check existing project components first
- **AND** the agent MUST prefer official or configured shadcn/ui components before raw HTML controls or custom component markup

#### Scenario: Existing components do not fit
- **WHEN** existing project components and shadcn/ui components cannot satisfy the UI requirement through reasonable composition or customization
- **THEN** the agent MAY create custom UI
- **AND** the agent MUST record why the shadcn-first path was insufficient in the relevant OpenSpec change or completion summary

#### Scenario: Third-party registry component is considered
- **WHEN** a third-party registry component is considered
- **THEN** the agent MUST inspect source, dependencies, imports, accessibility, compatibility, maintenance, and license before adoption
